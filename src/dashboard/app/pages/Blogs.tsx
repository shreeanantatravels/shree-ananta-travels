"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  Star,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Layers,
  Settings,
  RefreshCw,
  Share2,
  Globe,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileText,
  HelpCircle,
  Loader2,
  Compass,
} from 'lucide-react';
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryNavbarMutation,
  BlogData,
  BlogCategoryData,
} from '../api/blogsApi';
import { toast } from 'sonner';
import { useGetMeQuery } from '../api/authApi';
import { useGetSiteConfigQuery } from '../api/siteConfigApi';

function resolveLogoUrl(url?: string): string {
  if (!url) return '/uploads/shree-ananta-logo.webp';
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }
  return `/uploads/${url}`;
}

// ── Sanitize pasted HTML: strip junk (Google Docs meta, inline styles, etc.) ──
function sanitizePastedHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove script, style, meta, link, head tags
  doc.querySelectorAll('script,style,meta,link,head').forEach(el => el.remove());

  // Remove Google Docs internal wrapper spans (keep their children)
  doc.querySelectorAll('b[id^="docs-internal"]').forEach(el => {
    el.replaceWith(...Array.from(el.childNodes));
  });

  // Strip inline styles, classes, ids (keep semantic tags intact)
  doc.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
  doc.querySelectorAll('[class]').forEach(el => el.removeAttribute('class'));
  doc.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

  return doc.body.innerHTML;
}

// ── Upload a blob or data URL image, return server public URL ──
async function uploadDataUrlImage(dataUrl: string): Promise<string | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.includes('png') ? 'png' : blob.type.includes('gif') ? 'gif' : blob.type.includes('webp') ? 'webp' : 'jpg';
    const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, { type: blob.type });
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'blog');
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await uploadRes.json();
    return json.success && json.url ? json.url : null;
  } catch {
    return null;
  }
}

export function Blogs() {
  const { data: authData } = useGetMeQuery();
  const { data: siteConfigRes } = useGetSiteConfigQuery();
  const brandName = siteConfigRes?.data?.companyName || authData?.agent?.businessName || authData?.agent?.name || 'Shree Ananta Travels';
  const brandLogo = resolveLogoUrl(siteConfigRes?.data?.logoUrl || authData?.agent?.logo);
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'categories'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Editing state
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);

  // Fetch blogs & categories
  const { data: blogsResponse, isLoading: isBlogsLoading, refetch: refetchBlogs } = useGetBlogsQuery({
    admin: true,
    page,
    limit: 12,
    status: statusFilter,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    search: searchTerm,
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading, refetch: refetchCategories } = useGetCategoriesQuery();

  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdatingBlog }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeletingBlog }] = useDeleteBlogMutation();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [toggleCategoryNavbar, { isLoading: isTogglingNavbar }] = useToggleCategoryNavbarMutation();

  const blogs = blogsResponse?.data || [];
  const pagination = blogsResponse?.pagination || { page: 1, limit: 12, totalPages: 1, totalCount: 0, hasNextPage: false, hasPrevPage: false };
  const categories = categoriesResponse?.data || [];

  const navbarCategoriesCount = useMemo(() => {
    return categories.filter((c) => Boolean(c.showInNavbar)).length;
  }, [categories]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    coverImageAlt: '',
    author: 'Shree Ananta Travels Editorial Desk',
    category: '',
    categorySlug: '',
    subcategory: '',
    subcategorySlug: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published' | 'archived',
    isFeatured: false,
    scheduledAt: '',
    tags: '' as string,
    faq: [] as { question: string; answer: string }[],
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    noIndex: false,
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showAdvancedSeo, setShowAdvancedSeo] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isPasting, setIsPasting] = useState(false);
  const [selectedImageEl, setSelectedImageEl] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Refs
  const scheduledInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);

  // Set default paragraph separator to p for clean semantic paragraph editing
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        document.execCommand('defaultParagraphSeparator', false, 'p');
      } catch {
        // ignore if not supported in environment
      }
    }
  }, []);

  // Sync editor div content when formData.content changes externally (edit mode load)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    // Only sync if content differs (avoid cursor jump while typing)
    if (el.innerHTML !== formData.content) {
      el.innerHTML = formData.content;
    }
  }, [formData.content]);

  // Measure and align the overlay over the active image
  const updateOverlayRect = useCallback((img: HTMLImageElement) => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper || !img) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    setSelectedImageRect({
      top: imgRect.top - wrapperRect.top,
      left: imgRect.left - wrapperRect.left,
      width: imgRect.width,
      height: imgRect.height,
    });
  }, []);

  // Update overlay on scroll, resize, or selection changes
  useEffect(() => {
    if (!selectedImageEl) {
      setSelectedImageRect(null);
      return;
    }
    updateOverlayRect(selectedImageEl);

    const handleScrollOrResize = () => {
      if (selectedImageEl) updateOverlayRect(selectedImageEl);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [selectedImageEl, updateOverlayRect]);

  // Handle clicking outside editor wrapper to deselect image
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (editorWrapperRef.current && !editorWrapperRef.current.contains(e.target as Node)) {
        setSelectedImageEl(null);
        setSelectedImageRect(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Delete or Backspace to remove selected image
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageEl && (e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
        handleDeleteSelectedImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageEl]);

  // Set image width (percentage)
  const handleSetImageWidth = (width: string) => {
    if (!selectedImageEl) return;
    selectedImageEl.style.width = width;
    selectedImageEl.style.height = 'auto';
    updateOverlayRect(selectedImageEl);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  // Adjust width by percentage delta
  const handleAdjustImageWidth = (delta: number) => {
    if (!selectedImageEl || !editorWrapperRef.current) return;
    const currentWidth = selectedImageEl.offsetWidth;
    const wrapperWidth = editorWrapperRef.current.clientWidth - 40;
    const currentPercent = Math.round((currentWidth / wrapperWidth) * 100);
    const newPercent = Math.max(15, Math.min(100, currentPercent + delta));
    handleSetImageWidth(`${newPercent}%`);
  };

  // Set image alignment
  const handleSetImageAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedImageEl) return;
    selectedImageEl.style.display = 'block';
    if (align === 'center') {
      selectedImageEl.style.marginLeft = 'auto';
      selectedImageEl.style.marginRight = 'auto';
    } else if (align === 'left') {
      selectedImageEl.style.marginLeft = '0';
      selectedImageEl.style.marginRight = 'auto';
    } else if (align === 'right') {
      selectedImageEl.style.marginLeft = 'auto';
      selectedImageEl.style.marginRight = '0';
    }
    updateOverlayRect(selectedImageEl);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  // Delete selected image
  const handleDeleteSelectedImage = () => {
    if (!selectedImageEl) return;
    selectedImageEl.remove();
    setSelectedImageEl(null);
    setSelectedImageRect(null);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  // Mouse drag handle to resize image
  const handleResizeMouseDown = (e: React.MouseEvent, direction: 'se' | 'sw') => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImageEl || !editorWrapperRef.current) return;

    const startX = e.clientX;
    const startWidth = selectedImageEl.offsetWidth;
    const wrapperWidth = editorWrapperRef.current.clientWidth - 40;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = direction === 'se' ? moveEvent.clientX - startX : startX - moveEvent.clientX;
      const newWidthPx = Math.max(100, Math.min(wrapperWidth, startWidth + deltaX));
      const newPercent = Math.round((newWidthPx / wrapperWidth) * 100);
      selectedImageEl.style.width = `${newPercent}%`;
      selectedImageEl.style.height = 'auto';
      updateOverlayRect(selectedImageEl);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (editorRef.current) {
        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Click on contenteditable to select image or deselect
  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target && target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      setSelectedImageEl(img);
      updateOverlayRect(img);
    } else {
      setSelectedImageEl(null);
      setSelectedImageRect(null);
    }
  };

  // Handle keydown: ensure Enter inside headings drops down to a standard paragraph instead of continuing as H2
  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      let node: Node | null = sel.anchorNode;
      let headingEl: HTMLElement | null = null;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE && /^(H1|H2|H3|H4|H5|H6)$/i.test((node as HTMLElement).tagName)) {
          headingEl = node as HTMLElement;
          break;
        }
        node = node.parentNode;
      }
      if (headingEl) {
        setTimeout(() => {
          document.execCommand('formatBlock', false, 'p');
          if (editorRef.current) {
            setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
          }
        }, 0);
      }
    }
  };

  // ── WYSIWYG execCommand helper ──────────────────────────────────────────────
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    // sync state after command
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
    }
  };

  // ── Insert link prompt ──
  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. /packages or https://example.com):');
    if (!url) return;
    const text = window.getSelection()?.toString() || url;
    exec('insertHTML', `<a href="${url}">${text}</a>`);
  };

  // ── Insert image from toolbar (file picker) ──
  const handleInsertImageFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'blog');
    setIsPasting(true);
    toast.loading('Uploading image...', { id: 'editor-img' });
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        exec('insertHTML', `<img src="${json.url}" alt="Blog image" style="max-width:100%;border-radius:8px;margin:16px auto;display:block;" />`);
        toast.success('Image inserted!', { id: 'editor-img' });
      } else {
        toast.error('Image upload failed', { id: 'editor-img' });
      }
    } catch {
      toast.error('Image upload failed', { id: 'editor-img' });
    } finally {
      setIsPasting(false);
    }
  };

  // ── WYSIWYG Paste Handler ────────────────────────────────────────────────
  const handleWysiwygPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const cd = e.clipboardData;
    if (!cd) return;
    e.preventDefault();
    setIsPasting(true);

    // ── Case 1: Image files (screenshot / ctrl+v from image editor) ──
    const imageFiles = Array.from(cd.files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        await handleInsertImageFile(file);
      }
      setIsPasting(false);
      return;
    }

    // ── Case 2: HTML (Google Docs, Word, webpage) ──
    const html = cd.getData('text/html');
    if (html && html.trim()) {
      toast.loading('Processing pasted content...', { id: 'wysiwyg-paste' });

      // Sanitize + parse
      let cleanHtml = sanitizePastedHtml(html);

      // Find data: / blob: images and upload them
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanHtml, 'text/html');
      const imgEls = Array.from(doc.querySelectorAll('img'));
      let hadUploads = false;
      for (const imgEl of imgEls) {
        const src = imgEl.getAttribute('src') || '';
        if (src.startsWith('data:') || src.startsWith('blob:')) {
          hadUploads = true;
          const publicUrl = await uploadDataUrlImage(src);
          if (publicUrl) {
            imgEl.setAttribute('src', publicUrl);
            imgEl.setAttribute('style', 'max-width:100%;border-radius:8px;margin:16px auto;display:block;');
          } else {
            imgEl.remove();
          }
        } else if (src) {
          imgEl.setAttribute('style', 'max-width:100%;border-radius:8px;margin:16px auto;display:block;');
        }
      }
      cleanHtml = doc.body.innerHTML;

      document.execCommand('insertHTML', false, cleanHtml);
      if (editorRef.current) {
        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
      }
      toast.dismiss('wysiwyg-paste');
      if (hadUploads) toast.success('Images uploaded and content pasted successfully!');
      else toast.success('Content pasted with full formatting!');
      setIsPasting(false);
      return;
    }

    // ── Case 3: Plain text ──
    const text = cd.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
      if (editorRef.current) {
        setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
      }
    }
    setIsPasting(false);
  };

  const openCalendarPicker = () => {
    try {
      const el = scheduledInputRef.current;
      if (!el) return;
      if (typeof (el as any).showPicker === 'function') {
        (el as any).showPicker();
      } else {
        el.focus();
      }
    } catch (err) {
      scheduledInputRef.current?.focus();
    }
  };

  // Category Manager modal / inline state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catHeading, setCatHeading] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catSubcategories, setCatSubcategories] = useState<string>('');
  const [catShowInNavbar, setCatShowInNavbar] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategoryData | null>(null);

  // Quick Add Category Modal (used from Article Editor)
  const [showQuickCatModal, setShowQuickCatModal] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatNavbar, setQuickCatNavbar] = useState(false);
  const [isSavingQuickCat, setIsSavingQuickCat] = useState(false);

  // Auto-generate slug when title changes unless slug was manually edited
  const handleTitleChange = (newTitle: string) => {
    const slugified = newTitle
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugManuallyEdited ? prev.slug : slugified,
      seoTitle: prev.seoTitle ? prev.seoTitle : `${newTitle} | Shree Ananta Travels`,
    }));
  };

  const handleOpenNewArticle = () => {
    const firstCat = categories[0];
    setEditingBlog(null);
    setSlugManuallyEdited(false);
    setImageDimensions(null);
    setImageError(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      coverImage: '',
      coverImageAlt: '',
      author: 'Shree Ananta Travels Editorial Desk',
      category: firstCat ? firstCat.name : '',
      categorySlug: firstCat ? firstCat.slug : '',
      subcategory: '',
      subcategorySlug: '',
      status: 'draft',
      isFeatured: false,
      scheduledAt: '',
      tags: '',
      faq: [],
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      noIndex: false,
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
    });
    setActiveTab('editor');
  };

  const handleEditArticle = (blog: BlogData) => {
    setEditingBlog(blog);
    setSlugManuallyEdited(true);
    setImageDimensions(null);
    setImageError(null);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      coverImage: blog.coverImage || '',
      coverImageAlt: blog.coverImageAlt || '',
      author: blog.author || 'Shree Ananta Travels Editorial Desk',
      category: blog.category || '',
      categorySlug: blog.categorySlug || '',
      subcategory: blog.subcategory || '',
      subcategorySlug: blog.subcategorySlug || '',
      status: blog.status || 'draft',
      isFeatured: Boolean(blog.isFeatured),
      scheduledAt: blog.scheduledAt ? new Date(blog.scheduledAt).toISOString().slice(0, 16) : '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      faq: Array.isArray(blog.faq)
        ? blog.faq.map((f) => ({ question: f.question || '', answer: f.answer || '' }))
        : [],
      seoTitle: blog.seo?.title || `${blog.title} | Shree Ananta Travels`,
      seoDescription: blog.seo?.description || blog.excerpt || '',
      canonicalUrl: blog.seo?.canonicalUrl || '',
      noIndex: Boolean(blog.seo?.noIndex),
      ogTitle: blog.socialSharing?.ogTitle || blog.seo?.title || blog.title,
      ogDescription: blog.socialSharing?.ogDescription || blog.seo?.description || blog.excerpt,
      ogImage: blog.socialSharing?.ogImage || blog.coverImage || '',
    });
    setActiveTab('editor');
  };

  const handleCategorySelect = (selectedCatName: string) => {
    const found = categories.find((c) => c.name === selectedCatName);
    setFormData((prev) => ({
      ...prev,
      category: selectedCatName,
      categorySlug: found ? found.slug : '',
      subcategory: '',
      subcategorySlug: '',
    }));
  };

  const handleSubcategorySelect = (selectedSubName: string) => {
    const foundCat = categories.find((c) => c.name === formData.category);
    const foundSub = foundCat?.subcategories.find((s) => s.name === selectedSubName);
    setFormData((prev) => ({
      ...prev,
      subcategory: selectedSubName,
      subcategorySlug: foundSub ? foundSub.slug : '',
    }));
  };

  const handleAutoGenerateExcerpt = () => {
    if (!formData.content) {
      toast.error('Write article content first to generate an excerpt suggestion.');
      return;
    }
    // Strip HTML tags (content is now stored as HTML)
    const clean = formData.content
      .replace(/<[^>]*>/gm, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    const truncated = clean.length > 155 ? clean.substring(0, 155).trim() + '...' : clean;
    setFormData((prev) => ({
      ...prev,
      excerpt: truncated,
      seoDescription: prev.seoDescription ? prev.seoDescription : truncated,
    }));
    toast.success('Generated suggested excerpt from article content.');
  };

  const handleRegenerateSeoDescription = () => {
    if (formData.excerpt) {
      setFormData((prev) => ({ ...prev, seoDescription: prev.excerpt }));
      toast.success('Synced SEO description with excerpt.');
      return;
    }
    handleAutoGenerateExcerpt();
  };

  // FAQ management handlers
  const handleAddFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...(prev.faq || []), { question: '', answer: '' }],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faq: (prev.faq || []).filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const next = [...(prev.faq || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, faq: next };
    });
  };

  // Image Upload handler with dimension & format validation
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File size exceeds maximum allowed 5 MB.');
      toast.error('File size exceeds 5 MB.');
      return;
    }

    // Validate type
    const validTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setImageError('Only WebP, JPEG, and PNG images are accepted.');
      toast.error('Invalid image format. WebP, JPEG, or PNG required.');
      return;
    }

    // Measure dimensions using HTML5 Image object
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      setImageDimensions({ width, height });

      if (width < 1200 || height < 675) {
        toast.warning(`Note: Uploaded image is ${width}×${height}px. Recommended minimum resolution is 1200×675px.`);
      }

      // Proceed to upload
      setImageUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'blog');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const json = await res.json();
        if (!json.success || !json.url) {
          throw new Error(json.message || 'Image upload failed');
        }

        setFormData((prev) => ({
          ...prev,
          coverImage: json.url,
          coverImageAlt: prev.coverImageAlt || prev.title,
          ogImage: json.url,
        }));
        toast.success('Cover image uploaded successfully.');
      } catch (err: any) {
        setImageError(err.message || 'Upload failed');
        toast.error(err.message || 'Image upload failed');
      } finally {
        setImageUploading(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setImageError('Failed to read image file.');
      toast.error('Corrupted or invalid image file.');
    };
  };

  // Save / Publish Blog
  const handleSaveArticle = async (targetStatus: 'draft' | 'published' | 'scheduled' | 'archived') => {
    // Basic validation
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      toast.error('Article title is required (at least 3 characters).');
      return;
    }

    // Strict validation for publishing or scheduling
    if (targetStatus === 'published' || targetStatus === 'scheduled') {
      if (!formData.content.trim() || formData.content.trim().length < 20) {
        toast.error('Article content is required for publication (at least 20 characters).');
        return;
      }
      if (!formData.coverImage.trim()) {
        toast.error('A verified cover image is required for publication.');
        return;
      }
      if (!formData.category.trim()) {
        toast.error('Please select an article category.');
        return;
      }
      if (!formData.author.trim()) {
        toast.error('Please provide the "Published By" author display name.');
        return;
      }
      if (targetStatus === 'scheduled') {
        if (!formData.scheduledAt || new Date(formData.scheduledAt) <= new Date()) {
          toast.error('Please select a future date and time for scheduling.');
          return;
        }
      }
    }

    const payload: Partial<BlogData> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim(),
      coverImage: formData.coverImage.trim(),
      coverImageAlt: formData.coverImageAlt.trim(),
      author: formData.author.trim() || 'Shree Ananta Travels Editorial Desk',
      category: formData.category.trim(),
      categorySlug: formData.categorySlug.trim(),
      subcategory: formData.subcategory.trim(),
      subcategorySlug: formData.subcategorySlug.trim(),
      status: targetStatus,
      isFeatured: formData.isFeatured,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : undefined,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      faq: (formData.faq || [])
        .filter((f) => f.question.trim() || f.answer.trim())
        .map((f) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        })),
      seo: {
        title: formData.seoTitle.trim() || `${formData.title.trim()} | Shree Ananta Travels`,
        description: formData.seoDescription.trim() || formData.excerpt.trim(),
        canonicalUrl: formData.canonicalUrl.trim(),
        noIndex: formData.noIndex,
      },
      socialSharing: {
        ogTitle: formData.ogTitle.trim() || formData.seoTitle.trim() || formData.title.trim(),
        ogDescription: formData.ogDescription.trim() || formData.seoDescription.trim() || formData.excerpt.trim(),
        ogImage: formData.ogImage.trim() || formData.coverImage.trim(),
      },
    };

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, data: payload }).unwrap();
        toast.success(`Article successfully updated as ${targetStatus.toUpperCase()}!`);
      } else {
        await createBlog(payload).unwrap();
        toast.success(`Article successfully created as ${targetStatus.toUpperCase()}!`);
      }
      refetchBlogs();
      setActiveTab('list');
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to save article.');
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteBlog(id).unwrap();
      toast.success('Article deleted successfully.');
      refetchBlogs();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to delete article.');
    }
  };

  const handleToggleFeatured = async (blog: BlogData) => {
    try {
      await updateBlog({
        id: blog._id,
        data: { isFeatured: !blog.isFeatured },
      }).unwrap();
      toast.success(blog.isFeatured ? 'Article un-featured' : 'Article marked as featured!');
      refetchBlogs();
    } catch (err: any) {
      toast.error('Failed to toggle featured status.');
    }
  };

  // Category modal submission
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || catName.trim().length < 2) {
      toast.error('Category name is required.');
      return;
    }

    if (catShowInNavbar) {
      const isAlreadyNavbar = editingCategory ? Boolean(editingCategory.showInNavbar) : false;
      if (!isAlreadyNavbar && navbarCategoriesCount >= 18) {
        toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck "Show in Navbar" on an existing category first.');
        return;
      }
    }

    const subcats = catSubcategories
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        isActive: true,
      }));

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory._id,
          data: {
            name: catName.trim(),
            heading: catHeading.trim(),
            description: catDesc.trim(),
            subcategories: subcats,
            showInNavbar: catShowInNavbar,
          },
        }).unwrap();
        toast.success('Category updated successfully.');
      } else {
        await createCategory({
          name: catName.trim(),
          heading: catHeading.trim(),
          description: catDesc.trim(),
          subcategories: subcats,
          showInNavbar: catShowInNavbar,
        }).unwrap();
        toast.success('Category created successfully.');
      }
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatHeading('');
      setCatDesc('');
      setCatSubcategories('');
      setCatShowInNavbar(false);
      refetchCategories();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to save category.');
    }
  };

  const handleToggleNavbar = async (cat: BlogCategoryData) => {
    const willEnable = !cat.showInNavbar;
    if (willEnable && navbarCategoriesCount >= 18) {
      toast.error('A maximum of 18 categories can be added to the Navbar. Please remove a category from the Navbar first.');
      return;
    }
    try {
      const res = await toggleCategoryNavbar(cat._id).unwrap();
      toast.success(res.message || (willEnable ? `"${cat.name}" added to Navbar` : `"${cat.name}" removed from Navbar`));
      refetchCategories();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to update Navbar status.');
    }
  };

  const handleSaveQuickCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim() || quickCatName.trim().length < 2) {
      toast.error('Category name must be at least 2 characters.');
      return;
    }
    if (quickCatNavbar && navbarCategoriesCount >= 18) {
      toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck "Show in Navbar" on an existing category first.');
      return;
    }
    setIsSavingQuickCat(true);
    try {
      const res = await createCategory({
        name: quickCatName.trim(),
        showInNavbar: quickCatNavbar,
      }).unwrap();
      toast.success(`Category "${quickCatName}" created successfully!`);
      refetchCategories();
      if (res?.data) {
        setFormData((prev) => ({
          ...prev,
          category: res.data.name,
          categorySlug: res.data.slug,
        }));
      }
      setShowQuickCatModal(false);
      setQuickCatName('');
      setQuickCatNavbar(false);
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to create category.');
    } finally {
      setIsSavingQuickCat(false);
    }
  };

  const handleDeleteCategory = async (cat: BlogCategoryData) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat._id).unwrap();
      toast.success('Category deleted successfully.');
      refetchCategories();
    } catch (err: any) {
      toast.error(err.data?.message || err.message || 'Failed to delete category.');
    }
  };

  // Find subcategories for currently selected category in form
  const currentCategoryObj = categories.find((c) => c.name === formData.category);

  return (
    <div className="space-y-6">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/70 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-tight">
              Travel Blog Management
            </h1>
            <p className="text-xs text-gray-500 font-medium truncate sm:whitespace-normal">
              Publish SEO-optimized destination guides, travel tips, and yatra itineraries.
            </p>
          </div>
        </div>

        {/* Tab switchers & primary action - compact single-line layout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap overflow-x-auto scrollbar-none pb-0.5 lg:pb-0">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Articles</span>
          </button>

          <button
            onClick={() => {
              setEditingCategory(null);
              setCatName('');
              setCatHeading('');
              setCatDesc('');
              setCatSubcategories('');
              setCatShowInNavbar(false);
              setActiveTab('categories');
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Categories</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
            }`}>
              {navbarCategoriesCount}/18
            </span>
          </button>

          <button
            onClick={handleOpenNewArticle}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'editor' && !editingBlog
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* ── View 1: ARTICLE LISTING ─────────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search articles by title, tag..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filter pills: Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
              {(['all', 'published', 'draft', 'scheduled', 'archived'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Category Dropdown */}
            <div className="w-full lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Articles Table / Cards */}
          {isBlogsLoading ? (
            <div className="p-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/70 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs font-medium">Loading blog articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-200/70 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-gray-800">No blog articles found</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or status filters.'
                  : 'Start writing your first SEO-optimized travel article.'}
              </p>
              <button
                onClick={handleOpenNewArticle}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create First Article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blogs.map((blog) => {
                const isPublished = blog.status === 'published';
                const isScheduled = blog.status === 'scheduled';
                const isDraft = blog.status === 'draft';

                return (
                  <div
                    key={blog._id}
                    className="bg-white rounded-2xl border border-gray-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Cover image container */}
                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.coverImageAlt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                            isPublished
                              ? 'bg-emerald-500/90 text-white'
                              : isScheduled
                              ? 'bg-amber-500/90 text-white'
                              : isDraft
                              ? 'bg-gray-700/80 text-white'
                              : 'bg-purple-600/90 text-white'
                          }`}
                        >
                          {blog.status}
                        </span>

                        {blog.isFeatured && (
                          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-400 text-amber-950 flex items-center gap-1 shadow-sm">
                            <Star className="w-3 h-3 fill-amber-950" /> Featured
                          </span>
                        )}
                      </div>

                      {/* Featured quick toggle */}
                      <button
                        onClick={() => handleToggleFeatured(blog)}
                        title={blog.isFeatured ? 'Remove Featured' : 'Mark as Featured'}
                        className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                          blog.isFeatured
                            ? 'bg-amber-400 text-amber-900 shadow-md'
                            : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${blog.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Date */}
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-1.5">
                          <span className="text-blue-600 font-bold uppercase tracking-wider">
                            {blog.category}
                            {blog.subcategory ? ` • ${blog.subcategory}` : ''}
                          </span>
                          <span>
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'Draft'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {blog.excerpt || 'No summary excerpt provided.'}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate max-w-[120px]">{blog.author}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isPublished && (
                            <Link
                              href={`/blogs/${blog.slug}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Live Article"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          <button
                            onClick={() => handleEditArticle(blog)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteArticle(blog._id, blog.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-gray-200/70 text-xs text-gray-600">
              <span>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none rounded-lg font-bold transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:pointer-events-none rounded-lg font-bold transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── View 2: ARTICLE EDITOR ──────────────────────────────────── */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editing Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-5">
              {/* Title input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-semibold transition-colors ${
                      formData.title.length >= 55 && formData.title.length <= 70
                        ? 'text-emerald-600 font-bold'
                        : formData.title.length > 70
                        ? 'text-amber-600 font-medium'
                        : 'text-gray-400'
                    }`}
                  >
                    {formData.title.length} characters
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Best Time to Visit Kashmir: Complete Season-by-Season Travel Guide"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* URL Slug */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    URL Slug
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Auto-generated from title
                  </span>
                </div>
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-500 font-mono">
                  <span className="shrink-0 text-gray-400">/blogs/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') }));
                    }}
                    placeholder="best-time-to-visit-kashmir"
                    className="w-full bg-transparent pl-1 text-gray-900 font-mono font-medium focus:outline-none"
                  />
                </div>
                {editingBlog && editingBlog.slug !== formData.slug && (
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Changing the slug of an existing article will automatically create a 301 redirect from the previous URL.
                  </p>
                )}
              </div>

              {/* Excerpt with auto-generate button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Article Summary / Excerpt
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateExcerpt}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Suggest from Content
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short engaging summary displayed on listing cards and search previews..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Article Content Editor – WYSIWYG */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium italic">Visual WYSIWYG Editor — Live formatting preview</span>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                    {/* WYSIWYG Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-0.5 flex-wrap text-xs text-gray-700">
                      {/* Format select */}
                      <select
                        onChange={(e) => { exec('formatBlock', e.target.value); e.target.value = ''; }}
                        defaultValue=""
                        className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold cursor-pointer mr-1"
                        title="Paragraph style"
                      >
                        <option value="" disabled>Format</option>
                        <option value="p">Paragraph</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="h4">Heading 4</option>
                        <option value="blockquote">Blockquote</option>
                        <option value="pre">Code Block</option>
                      </select>

                      <div className="w-px h-5 bg-gray-200 mx-1" />

                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded font-bold cursor-pointer" title="Bold (Ctrl+B)">B</button>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded italic cursor-pointer" title="Italic (Ctrl+I)">I</button>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('underline'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded underline cursor-pointer" title="Underline (Ctrl+U)">U</button>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('strikeThrough'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded line-through cursor-pointer" title="Strikethrough">S</button>

                      <div className="w-px h-5 bg-gray-200 mx-1" />

                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer" title="Bullet List">• List</button>
                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer" title="Numbered List">1. List</button>

                      <div className="w-px h-5 bg-gray-200 mx-1" />

                      <button type="button" onMouseDown={(e) => { e.preventDefault(); handleInsertLink(); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer" title="Insert Link">🔗 Link</button>

                      {/* Image insert button */}
                      <label className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer" title="Insert Image">
                        🖼 Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleInsertImageFile(f);
                          e.target.value = '';
                        }} />
                      </label>

                      <div className="w-px h-5 bg-gray-200 mx-1" />

                      <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }}
                        className="px-2 py-1 hover:bg-gray-200 rounded cursor-pointer text-gray-500" title="Clear Formatting">✕ Clear</button>
                    </div>

                    {/* Active Selected Image Controls Bar in Toolbar */}
                    {selectedImageEl && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-3 py-2 flex items-center justify-between gap-2 flex-wrap text-xs text-blue-950 animate-fadeIn">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold flex items-center gap-1 text-blue-800">
                            <span>🖼 Image Resize:</span>
                          </span>
                          <div className="inline-flex rounded-lg border border-blue-200 bg-white p-0.5 shadow-xs">
                            {(['25%', '50%', '75%', '100%'] as const).map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleSetImageWidth(size)}
                                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                                  selectedImageEl.style.width === size
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-gray-700 hover:bg-blue-50'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>

                          <div className="w-px h-4 bg-blue-200 mx-0.5" />

                          <span className="font-bold text-blue-800 text-[11px]">Fine Tune:</span>
                          <button
                            type="button"
                            onClick={() => handleAdjustImageWidth(-10)}
                            className="px-2 py-0.5 bg-white border border-blue-200 rounded font-bold hover:bg-blue-100 cursor-pointer shadow-xs text-xs"
                            title="Decrease width by 10%"
                          >
                            − 10%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustImageWidth(10)}
                            className="px-2 py-0.5 bg-white border border-blue-200 rounded font-bold hover:bg-blue-100 cursor-pointer shadow-xs text-xs"
                            title="Increase width by 10%"
                          >
                            + 10%
                          </button>

                          <div className="w-px h-4 bg-blue-200 mx-0.5" />

                          <span className="font-bold text-blue-800 text-[11px]">Align:</span>
                          <button
                            type="button"
                            onClick={() => handleSetImageAlign('left')}
                            className="px-2 py-0.5 bg-white border border-blue-200 rounded hover:bg-blue-100 cursor-pointer text-xs"
                            title="Align Left"
                          >
                            ◀ Left
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetImageAlign('center')}
                            className="px-2 py-0.5 bg-white border border-blue-200 rounded hover:bg-blue-100 cursor-pointer text-xs"
                            title="Align Center"
                          >
                            ⏺ Center
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetImageAlign('right')}
                            className="px-2 py-0.5 bg-white border border-blue-200 rounded hover:bg-blue-100 cursor-pointer text-xs"
                            title="Align Right"
                          >
                            ▶ Right
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-blue-600 font-medium italic hidden md:inline">
                            (Or drag blue corner handles on image)
                          </span>
                          <button
                            type="button"
                            onClick={handleDeleteSelectedImage}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {isPasting && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700 font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Processing content &amp; uploading images, please wait...
                      </div>
                    )}

                    {/* WYSIWYG contenteditable area with interactive image resize overlay */}
                    <div ref={editorWrapperRef} className="relative w-full">
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onClick={handleEditorClick}
                        onKeyDown={handleEditorKeyDown}
                        onInput={() => {
                          if (editorRef.current) {
                            setFormData(prev => ({ ...prev, content: editorRef.current!.innerHTML }));
                          }
                        }}
                        onPaste={handleWysiwygPaste}
                        data-placeholder="Start typing your article... or paste content from Google Docs / Word with formatting and images."
                        className="w-full p-5 bg-white min-h-[380px] focus:outline-none wysiwyg-editor prose prose-sm max-w-none text-gray-800 leading-relaxed"
                        style={{
                          fontFamily: 'inherit',
                          lineHeight: '1.75',
                        }}
                      />

                      {/* Floating Image Resize Overlay & Corner Handles */}
                      {selectedImageRect && selectedImageEl && (
                        <div
                          className="absolute z-20 pointer-events-auto"
                          style={{
                            top: `${selectedImageRect.top}px`,
                            left: `${selectedImageRect.left}px`,
                            width: `${selectedImageRect.width}px`,
                            height: `${selectedImageRect.height}px`,
                          }}
                        >
                          {/* Highlight Border */}
                          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none shadow-sm ring-4 ring-blue-500/10" />

                          {/* Floating Quick Action Pill */}
                          <div
                            className={`absolute ${selectedImageRect.top < 45 ? '-bottom-12' : '-top-11'} left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-xl shadow-xl flex items-center gap-1.5 whitespace-nowrap z-30 border border-gray-700/60`}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <span className="text-[11px] font-semibold text-gray-400 mr-0.5">Size:</span>
                            {(['25%', '50%', '75%', '100%'] as const).map(size => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleSetImageWidth(size)}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                  selectedImageEl.style.width === size
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                {size}
                              </button>
                            ))}

                            <div className="w-px h-3 bg-gray-700 mx-0.5" />

                            <button
                              type="button"
                              onClick={() => handleSetImageAlign('left')}
                              className="px-1.5 py-0.5 text-gray-300 hover:bg-gray-800 rounded cursor-pointer text-[11px]"
                              title="Align Left"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetImageAlign('center')}
                              className="px-1.5 py-0.5 text-gray-300 hover:bg-gray-800 rounded cursor-pointer text-[11px]"
                              title="Align Center"
                            >
                              ⏺
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetImageAlign('right')}
                              className="px-1.5 py-0.5 text-gray-300 hover:bg-gray-800 rounded cursor-pointer text-[11px]"
                              title="Align Right"
                            >
                              ▶
                            </button>

                            <div className="w-px h-3 bg-gray-700 mx-0.5" />

                            <button
                              type="button"
                              onClick={handleDeleteSelectedImage}
                              className="px-1.5 py-0.5 text-red-300 hover:bg-red-900/60 rounded cursor-pointer text-[11px] font-bold"
                              title="Delete image"
                            >
                              🗑
                            </button>
                          </div>

                          {/* Bottom-right Drag Handle */}
                          <div
                            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-se-resize hover:scale-125 transition-transform z-30"
                            title="Drag to resize image"
                          />
                          {/* Bottom-left Drag Handle */}
                          <div
                            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md cursor-sw-resize hover:scale-125 transition-transform z-30"
                            title="Drag to resize image"
                          />
                        </div>
                      )}
                    </div>

                    <style>{`
                      .wysiwyg-editor:empty:before {
                        content: attr(data-placeholder);
                        color: #9ca3af;
                        font-style: italic;
                        pointer-events: none;
                      }
                      .wysiwyg-editor h2 { font-size: 1.4rem; font-weight: 900; color: #0a1c3d; margin: 1.5rem 0 0.75rem; border-top: 1px solid #e5e7eb; padding-top: 0.75rem; }
                      .wysiwyg-editor h3 { font-size: 1.15rem; font-weight: 700; color: #0a1c3d; margin: 1.25rem 0 0.5rem; }
                      .wysiwyg-editor h4 { font-size: 1rem; font-weight: 700; color: #0a1c3d; margin: 1rem 0 0.4rem; }
                      .wysiwyg-editor p { margin-bottom: 1rem; color: #374151; }
                      .wysiwyg-editor ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                      .wysiwyg-editor ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                      .wysiwyg-editor li { margin-bottom: 0.4rem; }
                      .wysiwyg-editor blockquote { border-left: 4px solid #d4af37; background: linear-gradient(to right, rgba(212,175,55,0.1), transparent); padding: 0.75rem 1rem; margin: 1rem 0; border-radius: 0 0.5rem 0.5rem 0; font-style: italic; color: #374151; }
                      .wysiwyg-editor a { color: #0a1c3d; font-weight: 700; text-decoration: underline; text-decoration-color: #d4af37; text-underline-offset: 3px; }
                      .wysiwyg-editor a:hover { color: #b8860b; }
                      .wysiwyg-editor img {
                        max-width: 100%;
                        border-radius: 8px;
                        margin: 1rem auto;
                        display: block;
                        cursor: pointer;
                        transition: outline 0.15s ease;
                      }
                      .wysiwyg-editor img:hover {
                        outline: 2px dashed #3b82f6;
                        outline-offset: 3px;
                      }
                      .wysiwyg-editor table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                      .wysiwyg-editor th { background: #0a1c3d; color: white; padding: 0.5rem 1rem; text-align: left; font-size: 0.8rem; }
                      .wysiwyg-editor td { padding: 0.5rem 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.8rem; color: #374151; }
                      .wysiwyg-editor tr:nth-child(even) td { background: #f9fafb; }
                      .wysiwyg-editor hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.5rem 0; }
                      .wysiwyg-editor pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; font-family: monospace; overflow-x: auto; font-size: 0.8rem; }
                      .wysiwyg-editor code { background: #f1f5f9; color: #0a1c3d; padding: 0.1rem 0.3rem; border-radius: 3px; font-family: monospace; font-size: 0.85em; }
                    `}</style>
                  </div>
              </div>
            </div>

            {/* ── FAQ Section: Question & Answer Builder ─────────────────── */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      Frequently Asked Questions (FAQs)
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {(formData.faq || []).length} {(formData.faq || []).length === 1 ? 'question' : 'questions'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Add structured Question & Answer pairs. These display in an interactive accordion on the blog page.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add FAQ
                </button>
              </div>

              {(!formData.faq || formData.faq.length === 0) ? (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
                  <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-700">No FAQs added yet</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 mb-3">
                    Click "Add FAQ" to provide questions & answers for travellers.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="px-3.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add First FAQ
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.faq.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md">
                          Question #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Question <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                          placeholder="e.g. Is Kailash Mansarovar Yatra open for Indian citizens via Nepal in 2027?"
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">
                          Answer <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={item.answer}
                          onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                          placeholder="Enter clear, informative answer..."
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 hover:border-amber-400 rounded-xl text-xs font-bold text-gray-600 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-white"
                  >
                    <Plus className="w-4 h-4 text-amber-600" />
                    Add Another Question & Answer
                  </button>
                </div>
              )}
            </div>

            {/* ── SEO Section: Simplified with Live Google Preview ────────── */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Search Engine Optimization (SEO)</h3>
                    <p className="text-[11px] text-gray-500">Automatically optimized defaults with full custom control.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvancedSeo(!showAdvancedSeo)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {showAdvancedSeo ? 'Hide Advanced' : 'Show Advanced'}
                </button>
              </div>

              {/* Live Google Search Card Preview */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Google Search Snippet Preview
                </p>
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-4 h-4 rounded-full border border-gray-200 bg-white overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={brandLogo}
                        alt={brandName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== '/uploads/shree-ananta-logo.webp' && target.src !== '/uploads/shree-ananta-logo.jpg') {
                            target.src = '/uploads/shree-ananta-logo.webp';
                          }
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-800 font-semibold truncate max-w-[150px]">{brandName}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] text-gray-400 truncate">
                      https://www.shreeanantatravels.com › blogs › {formData.slug || 'article-slug'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1">
                    {formData.seoTitle || (formData.title ? `${formData.title} | Shree Ananta Travels` : 'Travel Article Title | Shree Ananta Travels')}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {formData.seoDescription || formData.excerpt || 'Explore curated travel guides, yatra details, and holiday packages with Shree Ananta Travels.'}
                  </p>
                </div>
              </div>

              {/* SEO Title & Description Controls */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">SEO Title</label>
                    <span
                      className={`text-[11px] font-medium ${
                        formData.seoTitle.length > 60 ? 'text-amber-600' : 'text-gray-400'
                      }`}
                    >
                      {formData.seoTitle.length} / 60 recommended chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Title shown in browser tab and search engine results"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Meta Description</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleRegenerateSeoDescription}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Regenerate suggestion
                      </button>
                      <span
                        className={`text-[11px] font-medium ${
                          formData.seoDescription.length > 160 ? 'text-amber-600' : 'text-gray-400'
                        }`}
                      >
                        {formData.seoDescription.length} / 160 recommended chars
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.seoDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Search snippet summary (140-160 characters suggested)..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                {showAdvancedSeo && (
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700">Canonical URL Override (Optional)</label>
                      <input
                        type="text"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, canonicalUrl: e.target.value }))}
                        placeholder="Leave blank to use default self-referencing canonical URL"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={formData.noIndex}
                        onChange={(e) => setFormData((prev) => ({ ...prev, noIndex: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-xs text-gray-700 font-medium">
                        Instruct search engines not to index this article (noindex)
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* ── Social Sharing Preview (Collapsible) ───────────────────── */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowSocialPreview(!showSocialPreview)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Social Media Sharing Preview</h3>
                    <p className="text-[11px] text-gray-500">Facebook, LinkedIn & WhatsApp share cards.</p>
                  </div>
                </div>
                <button type="button" className="text-xs font-bold text-indigo-600">
                  {showSocialPreview ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {showSocialPreview && (
                <div className="space-y-4 pt-2">
                  {/* Social Card Preview */}
                  <div className="bg-gray-100 p-4 rounded-xl">
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 max-w-md shadow-sm">
                      <div className="aspect-[1.91/1] bg-gray-200 overflow-hidden">
                        {formData.coverImage ? (
                          <img
                            src={formData.ogImage || formData.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Cover Image Preview
                          </div>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-[10px] uppercase font-bold text-gray-400">
                          SHREEANANTATRAVELS.COM
                        </p>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {formData.ogTitle || formData.seoTitle || formData.title || 'Article Title'}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          {formData.ogDescription || formData.seoDescription || formData.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">OG Title Override</label>
                      <input
                        type="text"
                        value={formData.ogTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ogTitle: e.target.value }))}
                        placeholder="Leave blank to use SEO Title"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700">OG Description Override</label>
                      <input
                        type="text"
                        value={formData.ogDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, ogDescription: e.target.value }))}
                        placeholder="Leave blank to use Meta Description"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Settings Column (Right col) */}
          <div className="space-y-6">
            {/* Publish & Status Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Publication Controls
              </h3>

              {/* Status Radio / Select */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                  Article Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as any;
                    setFormData((prev) => {
                      let scheduledAt = prev.scheduledAt;
                      if (newStatus === 'scheduled' && !scheduledAt) {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        d.setHours(9, 0, 0, 0);
                        const pad = (n: number) => n.toString().padStart(2, '0');
                        scheduledAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                      }
                      return {
                        ...prev,
                        status: newStatus,
                        scheduledAt,
                      };
                    });
                    if (newStatus === 'scheduled') {
                      setTimeout(() => openCalendarPicker(), 150);
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Live)</option>
                  <option value="scheduled">Scheduled (Future)</option>
                  <option value="archived">Archived (Unlisted)</option>
                </select>
              </div>

              {/* Scheduled date picker */}
              {formData.status === 'scheduled' && (
                <div
                  onClick={openCalendarPicker}
                  className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80 space-y-2 cursor-pointer hover:border-blue-400/80 transition-all group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <label
                      onClick={(e) => {
                        e.stopPropagation();
                        openCalendarPicker();
                      }}
                      className="text-xs font-bold text-blue-950 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Scheduled Publication Date
                    </label>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCalendarPicker();
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Open Calendar 📅
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      ref={scheduledInputRef}
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onClick={(e) => {
                        e.stopPropagation();
                        try {
                          (e.currentTarget as any).showPicker?.();
                        } catch (err) {}
                      }}
                      onFocus={(e) => {
                        try {
                          (e.currentTarget as any).showPicker?.();
                        } catch (err) {}
                      }}
                      onChange={(e) => setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-blue-300 focus:border-blue-600 rounded-xl text-xs font-bold text-gray-900 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-blue-700/90 font-medium">
                    Click anywhere on this input or button to choose date &amp; time from the calendar.
                  </p>
                </div>
              )}

              {/* Featured article checkbox */}
              <label className="flex items-start gap-2.5 p-3 bg-blue-50/40 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Mark as Featured Article</span>
                  <span className="text-[10px] text-gray-500 leading-tight block">
                    Displays prominently in the large top hero slot on the blog listing page. Only one article is featured at a time.
                  </span>
                </div>
              </label>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  disabled={isCreatingBlog || isUpdatingBlog}
                  onClick={() => handleSaveArticle('published')}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCreatingBlog || isUpdatingBlog ? 'Saving...' : 'Publish Article Now'}
                </button>

                <button
                  type="button"
                  disabled={isCreatingBlog || isUpdatingBlog}
                  onClick={() => handleSaveArticle(formData.status === 'published' ? 'published' : 'draft')}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Cover Image Upload Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Cover Image <span className="text-red-500">*</span>
                </h3>
                {imageDimensions && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {imageDimensions.width}×{imageDimensions.height}px
                  </span>
                )}
              </div>

              {/* Dimension Guidance Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-blue-900">
                  Recommended size: 1600 × 900 px (16:9)
                </p>
                <p className="text-[10px] text-blue-700 leading-normal">
                  Other dimensions accepted, but image may crop. WebP, JPEG, PNG. Max 5 MB. Min recommended: 1200 × 675 px.
                </p>
              </div>

              {/* Image Preview / Upload Box */}
              <div className="relative aspect-[16/9] bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden flex flex-col items-center justify-center group">
                {formData.coverImage ? (
                  <>
                    <img
                      src={formData.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-100 shadow-md">
                        Change
                        <input
                          type="file"
                          accept="image/webp,image/jpeg,image/png,image/jpg"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-md cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-100/60 transition-colors">
                    {imageUploading ? (
                      <div className="flex flex-col items-center gap-2 text-blue-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs font-bold text-gray-700">Click to upload cover image</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">WebP, JPEG, PNG up to 5 MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/webp,image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handleImageFileChange}
                      disabled={imageUploading}
                    />
                  </label>
                )}
              </div>

              {imageError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {imageError}
                </p>
              )}

              {/* Alt Text Input */}
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.coverImageAlt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coverImageAlt: e.target.value }))}
                  placeholder="Descriptive alt text for image"
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Author / "Published By" Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Author & Attribution <span className="text-red-500">*</span>
              </h3>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Published By (Author Display Name)
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="e.g. Shree Ananta Travels Editorial Desk"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Shown directly on the public article page and in Google Schema.
                </p>
              </div>
            </div>

            {/* Taxonomy & Categorization Card */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Category & Tags <span className="text-red-500">*</span>
              </h3>

              {/* Primary Category */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-gray-600">
                    Primary Category <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickCatName('');
                      setQuickCatNavbar(false);
                      setShowQuickCatModal(true);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Category
                  </button>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name} {c.showInNavbar ? '★ (In Navbar)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {currentCategoryObj && currentCategoryObj.subcategories.length > 0 && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                    Subcategory (Optional)
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleSubcategorySelect(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                  >
                    <option value="">None</option>
                    {currentCategoryObj.subcategories.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="Kashmir, Gulmarg, Snow, Honeymoon"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View 3: CATEGORY MANAGER ────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add / Edit Category Form (1 col) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Kailash Mansarovar"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              {/* Show In Navbar Switch Card */}
              <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-3.5 space-y-2.5 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label 
                      onClick={() => {
                        if (!catShowInNavbar) {
                          const isAlready = editingCategory ? Boolean(editingCategory.showInNavbar) : false;
                          if (!isAlready && navbarCategoriesCount >= 18) {
                            toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck an existing category first.');
                            return;
                          }
                        }
                        setCatShowInNavbar(!catShowInNavbar);
                      }}
                      className="text-xs font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      Show in Website Navbar
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Display in top navigation Blogs menu
                    </p>
                  </div>

                  {/* iOS Style Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={catShowInNavbar}
                    onClick={() => {
                      if (!catShowInNavbar) {
                        const isAlready = editingCategory ? Boolean(editingCategory.showInNavbar) : false;
                        if (!isAlready && navbarCategoriesCount >= 18) {
                          toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck an existing category first.');
                          return;
                        }
                      }
                      setCatShowInNavbar(!catShowInNavbar);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      catShowInNavbar ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        catShowInNavbar ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium">Navbar Capacity</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    navbarCategoriesCount >= 18
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  }`}>
                    {navbarCategoriesCount} / 18 categories used
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Page Heading / Title (Optional)
                </label>
                <input
                  type="text"
                  value={catHeading}
                  onChange={(e) => setCatHeading(e.target.value)}
                  placeholder="e.g. Kailash Mansarovar Yatra Blogs"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Displays as the primary H1 title on the dedicated category page. If left blank, defaults to "[Category Name] Yatra Blogs".
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Travel Literature &amp; Overview (Optional)
                  </label>
                  <span className="text-[10px] text-gray-400 font-medium">Optional</span>
                </div>
                <textarea
                  rows={4}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Detailed travel literature, spiritual significance, and overview shown at the top of the category landing page with an expandable Read More toggle."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Subcategories (Comma separated)
                </label>
                <input
                  type="text"
                  value={catSubcategories}
                  onChange={(e) => setCatSubcategories(e.target.value)}
                  placeholder="Jim Corbett, Ranthambore, Gir"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCatName('');
                      setCatHeading('');
                      setCatDesc('');
                      setCatSubcategories('');
                      setCatShowInNavbar(false);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Categories List (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Manage Active Categories ({categories.length})
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                  navbarCategoriesCount >= 18 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200/70'
                }`}>
                  <Globe className="w-3.5 h-3.5" />
                  Navbar: <strong className="font-bold">{navbarCategoriesCount} / 18</strong>
                  {navbarCategoriesCount >= 18 && (
                    <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded-full font-black">
                      MAX
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm hover:border-gray-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                      <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        /{cat.slug}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {cat.publishedCount || 0} articles
                      </span>
                    </div>
                    {cat.heading && (
                      <p className="text-xs font-semibold text-blue-700 line-clamp-1">Heading: {cat.heading}</p>
                    )}
                    {cat.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{cat.description}</p>
                    )}
                    {cat.subcategories.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-gray-400 font-semibold">Subcategories:</span>
                        {cat.subcategories.map((sub, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleNavbar(cat)}
                      disabled={isTogglingNavbar}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        cat.showInNavbar
                          ? 'bg-blue-50 hover:bg-red-50 text-blue-700 hover:text-red-700 border-blue-200 hover:border-red-200 group/btn'
                          : 'bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 border-gray-200 hover:border-blue-200'
                      }`}
                      title={cat.showInNavbar ? 'Click to remove from Navbar' : 'Click to add to Navbar'}
                    >
                      {cat.showInNavbar ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-blue-600 group-hover/btn:bg-red-500 transition-colors" />
                          <span className="group-hover/btn:hidden">In Navbar</span>
                          <span className="hidden group-hover/btn:inline">Remove</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Add to Nav</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCatName(cat.name);
                        setCatHeading(cat.heading || '');
                        setCatDesc(cat.description || '');
                        setCatSubcategories(cat.subcategories.map((s) => s.name).join(', '));
                        setCatShowInNavbar(Boolean(cat.showInNavbar));
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Add Category Modal (Accessible from Article Editor) ── */}
      {showQuickCatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Add New Category
              </h3>
              <button
                type="button"
                onClick={() => setShowQuickCatModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickCategory} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  placeholder="e.g. Kashmir Tours"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                  required
                  autoFocus
                />
              </div>

              {/* Show In Navbar Switch Card in modal */}
              <div className="bg-gray-50 border border-gray-200/90 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <label 
                      onClick={() => {
                        if (!quickCatNavbar && navbarCategoriesCount >= 18) {
                          toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck an existing category first.');
                          return;
                        }
                        setQuickCatNavbar(!quickCatNavbar);
                      }}
                      className="text-xs font-bold text-gray-900 flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      Show in Website Navbar
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Display in top navigation Blogs menu
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={quickCatNavbar}
                    onClick={() => {
                      if (!quickCatNavbar && navbarCategoriesCount >= 18) {
                        toast.error('A maximum of 18 categories can be added to the Navbar. Please uncheck an existing category first.');
                        return;
                      }
                      setQuickCatNavbar(!quickCatNavbar);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      quickCatNavbar ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        quickCatNavbar ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500 font-medium">Navbar Capacity</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    navbarCategoriesCount >= 18
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  }`}>
                    {navbarCategoriesCount} / 18 categories used
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickCatModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuickCat}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {isSavingQuickCat && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create &amp; Select Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

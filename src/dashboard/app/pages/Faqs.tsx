"use client";
import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Loader2,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useReorderFaqsMutation,
  FaqData,
} from '../api/faqsApi';
import { toast } from 'sonner';

export function Faqs() {
  const { data, isLoading } = useGetFaqsQuery();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [reorderFaqs] = useReorderFaqsMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqData | null>(null);

  // Modal Form State
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formIsActive, setFormIsActive] = useState(true);

  const faqs = data?.data || [];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqData) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || 'General');
    setFormIsActive(faq.isActive);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formQuestion.trim() || formQuestion.trim().length < 5) {
      toast.error('Question must be at least 5 characters long.');
      return;
    }

    if (!formAnswer.trim() || formAnswer.trim().length < 10) {
      toast.error('Answer must be at least 10 characters long.');
      return;
    }

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          data: {
            question: formQuestion.trim(),
            answer: formAnswer.trim(),
            category: formCategory.trim(),
            isActive: formIsActive,
          },
        }).unwrap();
        toast.success('FAQ updated successfully!');
      } else {
        await createFaq({
          question: formQuestion.trim(),
          answer: formAnswer.trim(),
          category: formCategory.trim(),
          isActive: formIsActive,
          position: faqs.length,
        }).unwrap();
        toast.success('New FAQ added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to save FAQ');
    }
  };

  const handleToggleActive = async (faq: FaqData) => {
    try {
      await updateFaq({
        id: faq._id,
        data: { isActive: !faq.isActive },
      }).unwrap();
      toast.success(`FAQ ${!faq.isActive ? 'activated' : 'deactivated'}!`);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (!confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      return;
    }

    try {
      await deleteFaq(id).unwrap();
      toast.success('FAQ deleted successfully!');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    const orders = newFaqs.map((f, pos) => ({ id: f._id, position: pos }));

    try {
      await reorderFaqs(orders).unwrap();
      toast.success('FAQ order updated!');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to reorder');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <span>FAQs Management</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage frequently asked questions displayed on the public website. Add, edit, reorder, or toggle visibility.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or answers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 self-end sm:self-auto">
          <span>Total: <strong className="text-gray-900">{faqs.length}</strong></span>
          <span>•</span>
          <span>Active: <strong className="text-emerald-600">{faqs.filter((f) => f.isActive).length}</strong></span>
          <span>•</span>
          <span>Inactive: <strong className="text-gray-400">{faqs.filter((f) => !f.isActive).length}</strong></span>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading FAQs from database...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No FAQs Found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {searchTerm
              ? `No questions matching "${searchTerm}". Try another search term.`
              : 'There are currently no FAQs in the database. Click "Add New FAQ" to create your first question.'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq._id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                faq.isActive ? 'border-gray-200 hover:border-blue-200' : 'border-gray-200 opacity-60 bg-gray-50/60'
              }`}
            >
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    {faq.category || 'General'}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      faq.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                  >
                    {faq.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-400">Order #{index + 1}</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  {faq.question}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {faq.answer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  title="Move Up"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Move Down"
                  disabled={index === faqs.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-gray-200 mx-1" />

                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  title={faq.isActive ? 'Deactivate FAQ' : 'Activate FAQ'}
                  onClick={() => handleToggleActive(faq)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    faq.isActive
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {faq.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  title="Edit FAQ"
                  onClick={() => handleOpenEditModal(faq)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  title="Delete FAQ"
                  onClick={() => handleDelete(faq._id, faq.question)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g. Can I customize my travel package?"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Provide an honest, clear, and helpful answer for customers..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Booking, Payment, Yatra"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="faqIsActive"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="faqIsActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Active (Visible on Website)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingFaq ? 'Update FAQ' : 'Create FAQ'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

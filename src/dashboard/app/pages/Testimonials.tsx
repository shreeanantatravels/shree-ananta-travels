"use client";
import { useState } from 'react';
import { Plus, Star, Edit, Trash2, Loader2 } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useGetTestimonialsQuery, useCreateTestimonialMutation, useUpdateTestimonialMutation, useDeleteTestimonialMutation } from '../api/testimonialApi';
import { toast } from 'sonner';

export function Testimonials() {
  const { data, isLoading } = useGetTestimonialsQuery();
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [editState, setEditState] = useState<Record<string, any>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ customerName: '', destination: '', rating: 5, review: '' });

  const testimonials = data?.data || [];

  const handleCreate = async () => {
    if (!newForm.customerName || !newForm.review) { toast.error('Name and review are required'); return; }
    try {
      await createTestimonial(newForm).unwrap();
      toast.success('Testimonial added!');
      setNewForm({ customerName: '', destination: '', rating: 5, review: '' });
      setShowAdd(false);
    } catch (err: any) { toast.error(err?.data?.message || 'Failed to add'); }
  };

  const handleUpdate = async (id: string) => {
    const edit = editState[id];
    if (!edit) return;
    try {
      await updateTestimonial({ id, data: edit }).unwrap();
      toast.success('Testimonial updated!');
      setEditState(prev => { const n = { ...prev }; delete n[id]; return n; });
    } catch (err: any) { toast.error(err?.data?.message || 'Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try { await deleteTestimonial(id).unwrap(); toast.success('Deleted!'); }
    catch (err: any) { toast.error(err?.data?.message || 'Failed to delete'); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage customer reviews — shown on your marketplace</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-fit">
          <Plus className="w-5 h-5" />{showAdd ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {/* Add New Form */}
      {showAdd && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">New Testimonial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <Input type="text" value={newForm.customerName} onChange={(e) => setNewForm(p => ({ ...p, customerName: e.target.value }))}
                placeholder="Rahul Sharma" className="h-auto py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <Input type="text" value={newForm.destination} onChange={(e) => setNewForm(p => ({ ...p, destination: e.target.value }))}
                placeholder="Bali" className="h-auto py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setNewForm(p => ({ ...p, rating: s }))}
                  className={`p-1 ${s <= newForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
            <Textarea rows={3} value={newForm.review} onChange={(e) => setNewForm(p => ({ ...p, review: e.target.value }))}
              placeholder="Write the customer's review..." />
          </div>
          <button onClick={handleCreate} disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isCreating ? 'Adding...' : 'Add Testimonial'}
          </button>
        </div>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((t) => {
          const edit = editState[t._id];
          const isEditing = !!edit;
          const display = edit || { customerName: t.customerName, destination: t.destination, rating: t.rating, review: t.review };
          return (
            <div key={t._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-80 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {t.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.customerName}</p>
                      {t.destination && <p className="text-sm text-gray-500">{t.destination}</p>}
                    </div>
                  </div>
                  {isEditing && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input value={display.customerName} onChange={(e) => setEditState(p => ({ ...p, [t._id]: { ...display, customerName: e.target.value } }))} className="h-auto py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <Input value={display.destination} onChange={(e) => setEditState(p => ({ ...p, [t._id]: { ...display, destination: e.target.value } }))} className="h-auto py-2" />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} disabled={!isEditing}
                          onClick={() => isEditing && setEditState(p => ({ ...p, [t._id]: { ...display, rating: s } }))}
                          className={`p-1 ${s <= display.rating ? 'text-yellow-400' : 'text-gray-300'} ${isEditing ? 'cursor-pointer' : ''}`}>
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <Textarea rows={4} value={display.review} onChange={(e) => setEditState(p => ({ ...p, [t._id]: { ...display, review: e.target.value } }))} />
                  ) : (
                    <p className="text-gray-700 italic">"{t.review}"</p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Added {new Date(t.createdAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleUpdate(t._id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                            <Edit className="w-4 h-4" />Save
                          </button>
                          <button onClick={() => setEditState(p => { const n = { ...p }; delete n[t._id]; return n; })} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setEditState(p => ({ ...p, [t._id]: { customerName: t.customerName, destination: t.destination, rating: t.rating, review: t.review } }))}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                          <Edit className="w-4 h-4" />Edit
                        </button>
                      )}
                      <button onClick={() => handleDelete(t._id)} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm">
                        <Trash2 className="w-4 h-4" />Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {testimonials.length === 0 && !showAdd && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
          <p className="text-gray-600 mb-6">Add customer reviews to build trust on your marketplace</p>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />Add Your First Testimonial
          </button>
        </div>
      )}
    </div>
  );
}


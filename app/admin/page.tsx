"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Plus, 
  Copy, 
  RefreshCw, 
  Edit3, 
  Check, 
  X,
  PackageSearch,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
type OrderStatus = 'PENDING' | 'PURCHASED' | 'SHIPPING' | 'ARRIVED' | 'DONE';

interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  item_name: string;
  status: OrderStatus;
  receipt_number: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PURCHASED: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPING: "bg-purple-100 text-purple-800 border-purple-200",
  ARRIVED: "bg-teal-100 text-teal-800 border-teal-200",
  DONE: "bg-green-100 text-green-800 border-green-200",
};

const STATUS_OPTIONS: OrderStatus[] = ['PENDING', 'PURCHASED', 'SHIPPING', 'ARRIVED', 'DONE'];

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New Order Form
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    customer_phone: "",
    item_name: "",
    status: "PENDING" as OrderStatus,
  });

  // Edit State
  const [editingReceipt, setEditingReceipt] = useState<{id: string, value: string} | null>(null);
  
  // Notification State
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success'|'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    
    if (statusFilter !== "ALL") {
      query = query.eq("status", statusFilter);
    }
    
    if (searchQuery) {
      query = query.ilike("customer_name", `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching orders:", error);
      showToast("Gagal mengambil data pesanan", "error");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setIsCheckingAuth(false);
        fetchOrders();
      }
    };
    
    checkAuth();
  }, [statusFilter, searchQuery]); // Re-fetch on filter change

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  };

  const generateOrderCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `JST-${randomNum}`;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const order_code = generateOrderCode();
    
    const { data, error } = await supabase.from("orders").insert([
      {
        order_code,
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        item_name: newOrder.item_name,
        status: newOrder.status,
      }
    ]).select();

    if (error) {
      console.error("Error creating order:", error);
      showToast("Gagal membuat pesanan baru", "error");
    } else {
      showToast(`Pesanan ${order_code} berhasil dibuat!`, "success");
      setIsModalOpen(false);
      setNewOrder({ customer_name: "", customer_phone: "", item_name: "", status: "PENDING" });
      fetchOrders(); // Refresh table
    }
    
    setIsSubmitting(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);
      
    if (error) {
      showToast("Gagal mengubah status", "error");
    } else {
      showToast("Status berhasil diperbarui", "success");
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const handleSaveReceipt = async (id: string) => {
    if (!editingReceipt || editingReceipt.id !== id) return;
    
    const { error } = await supabase
      .from("orders")
      .update({ receipt_number: editingReceipt.value || null })
      .eq("id", id);
      
    if (error) {
      showToast("Gagal menyimpan resi", "error");
    } else {
      showToast("Nomor resi disimpan", "success");
      setOrders(orders.map(o => o.id === id ? { ...o, receipt_number: editingReceipt.value || null } : o));
      setEditingReceipt(null);
    }
  };

  const handleCopyWALink = (order: Order) => {
    const trackingUrl = `${window.location.origin}/track/${order.order_code}`;
    const message = `Halo Kak ${order.customer_name}, pesanan jastip dengan barang "${order.item_name}" sudah terdaftar.\n\nLacak status pesanan secara live di sini:\n${trackingUrl}`;
    
    // Create wa.me link to just open directly if preferred, but copying to clipboard is what's requested
    navigator.clipboard.writeText(message).then(() => {
      showToast("Pesan WhatsApp disalin ke Clipboard!", "success");
    }).catch(() => {
      showToast("Gagal menyalin text", "error");
    });
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-10">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toast.message}
        </div>
      )}

      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <PackageSearch className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Jastip Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">
                Lihat Web Publik
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="ALL">Semua Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <button 
              onClick={() => fetchOrders()}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-xl shadow-sm transition-all shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Pesanan Baru
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Kode Order</th>
                  <th className="px-6 py-4">Pelanggan</th>
                  <th className="px-6 py-4">Barang</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Nomor Resi</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                      Memuat data...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada pesanan ditemukan.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md text-sm border border-slate-200">
                          {order.order_code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{order.customer_name}</div>
                        <div className="text-xs text-slate-500 mt-1">{order.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 max-w-[200px] truncate" title={order.item_name}>
                          {order.item_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status} className="bg-white text-slate-900">{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {editingReceipt?.id === order.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingReceipt.value}
                              onChange={(e) => setEditingReceipt({...editingReceipt, value: e.target.value})}
                              className="w-32 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                              placeholder="Input resi..."
                              autoFocus
                            />
                            <button onClick={() => handleSaveReceipt(order.id)} className="text-green-600 hover:text-green-700 p-1 bg-green-50 rounded">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingReceipt(null)} className="text-red-500 hover:text-red-600 p-1 bg-red-50 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/edit">
                            <span className={`text-sm ${order.receipt_number ? 'text-slate-700 font-mono' : 'text-slate-400 italic'}`}>
                              {order.receipt_number || 'Belum ada'}
                            </span>
                            <button 
                              onClick={() => setEditingReceipt({ id: order.id, value: order.receipt_number || '' })}
                              className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                              title="Edit Resi"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleCopyWALink(order)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg transition-colors font-semibold text-xs"
                          title="Copy Link Tracking & Pesan WA"
                        >
                          <Copy className="w-3.5 h-3.5 mr-1.5" />
                          Copy WA
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Tambah Pesanan Baru</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pelanggan</label>
                <input
                  type="text"
                  required
                  value={newOrder.customer_name}
                  onChange={(e) => setNewOrder({...newOrder, customer_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Misal: Budi Santoso"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  required
                  value={newOrder.customer_phone}
                  onChange={(e) => setNewOrder({...newOrder, customer_phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Misal: 6281234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Barang</label>
                <textarea
                  required
                  rows={3}
                  value={newOrder.item_name}
                  onChange={(e) => setNewOrder({...newOrder, item_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Deskripsi atau nama barang..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status Awal</label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({...newOrder, status: e.target.value as OrderStatus})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Pesanan'
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

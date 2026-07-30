import { supabase } from "@/lib/supabase";
import {
  ClipboardList,
  ShoppingBag,
  Truck,
  PackageCheck,
  CheckCircle2,
  ArrowLeft,
  MessageCircle,
  Package
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Pesanan Diterima', icon: ClipboardList },
  { id: 'PURCHASED', label: 'Barang Telah Dibeli', icon: ShoppingBag },
  { id: 'SHIPPING', label: 'Dalam Pengiriman', icon: Truck },
  { id: 'ARRIVED', label: 'Barang Sampai', icon: PackageCheck },
  { id: 'DONE', label: 'Selesai', icon: CheckCircle2 },
];

export default async function TrackOrderPage({ params }: { params: { orderCode: string } }) {
  const orderCode = params.orderCode;

  // Fetch data from Supabase
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .single();

  if (error || !order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4 text-red-500">
            <Package className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-6">Kode pesanan "{orderCode}" tidak valid atau belum terdaftar di sistem kami.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Pencarian
          </Link>
        </div>
      </main>
    );
  }

  const currentStatusIndex = STATUS_STEPS.findIndex(step => step.id === order.status);

  // Format WA Message
  const adminPhone = "6281939601378"; // Ganti dengan nomor WA Admin yang sesungguhnya
  const waMessage = encodeURIComponent(`Halo Admin Jastip, saya ingin menanyakan status pesanan saya dengan kode *${order.order_code}*.\n\nNama Barang: ${order.item_name}`);
  const waLink = `https://wa.me/${adminPhone}?text=${waMessage}`;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header Navigation */}
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </Link>

        {/* Order Card Info */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">KODE PESANAN</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{order.order_code}</h1>
            </div>
            <div className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-sm rounded-full border border-indigo-100">
              {order.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1">Nama Pelanggan</p>
              <p className="font-semibold text-slate-800">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Nama Barang</p>
              <p className="font-semibold text-slate-800">{order.item_name}</p>
            </div>
            {order.receipt_number && (
              <div className="md:col-span-2">
                <p className="text-xs text-slate-500 mb-1">Nomor Resi</p>
                <div className="flex items-center bg-white border border-slate-200 px-3 py-2 rounded-lg">
                  <span className="font-mono text-slate-700 tracking-wider flex-1">{order.receipt_number}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Status Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Status Perjalanan</h2>

          <div className="relative pl-4 md:pl-0">
            <div className="space-y-8">
              {STATUS_STEPS.map((step, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isLast = index === STATUS_STEPS.length - 1;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-start group">
                    {/* Vertical Line Connector */}
                    {!isLast && (
                      <div className={`absolute top-10 left-6 md:left-[2.1rem] -ml-px h-full w-0.5 transition-colors duration-300 ${isActive ? 'bg-indigo-500' : 'bg-slate-200'}`} aria-hidden="true" />
                    )}

                    {/* Icon Container */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isActive ? 'bg-indigo-500 border-indigo-100' : 'bg-white border-slate-200'}`}>
                        <Icon className={`w-5 h-5 md:w-7 md:h-7 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="ml-6 md:ml-8 mt-2 md:mt-4 flex-1">
                      <h3 className={`font-semibold text-base md:text-lg transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-indigo-600 font-medium mt-1">
                          Posisi saat ini
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 pb-8">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Tanyakan via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}

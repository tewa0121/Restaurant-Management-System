import React, { useEffect, useState } from 'react';
import { RefreshCw, Truck, X } from 'lucide-react';
import deliveryService from '../../services/deliveryService';

const DELIVERY_STATUSES = [
  'assigned',
  'picked_up',
  'out_for_delivery',
  'delivered',
  'failed',
  'cancelled',
];

export default function DeliveryManagement() {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [assignTarget, setAssignTarget] = useState(null);
  const [driverId, setDriverId] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('30');

  const loadDeliveries = async () => {
    setLoading(true);
    setError('');
    try {
      const [list, driverList] = await Promise.all([
        deliveryService.getDeliveries({ limit: 100 }),
        deliveryService.getDrivers().catch(() => []),
      ]);
      setDeliveries(list);
      setDrivers(driverList);
      if (driverList.length > 0 && !driverId) {
        setDriverId(String(driverList[0].id));
      }
    } catch (err) {
      setError(err.message || 'Failed to load deliveries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const openAssignModal = (del) => {
    setAssignTarget(del);
    const currentDriver = del.driverId || del.driver_id || (drivers[0] ? drivers[0].id : '');
    setDriverId(currentDriver ? String(currentDriver) : '');
    setEstimatedTime(String(del.estimatedTime ?? del.estimated_time ?? 30));
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignTarget || !driverId) return;
    const orderId = assignTarget.orderId || assignTarget.order_id || assignTarget.id;
    setSaving(true);
    setError('');
    try {
      await deliveryService.assignDriver(orderId, Number(driverId), Number(estimatedTime) || 30);
      setAssignTarget(null);
      await loadDeliveries();
    } catch (err) {
      setError(err.message || 'Failed to assign driver.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (del, nextStatus) => {
    const orderId = del.orderId || del.order_id || del.id;
    setError('');
    try {
      await deliveryService.updateStatus(orderId, nextStatus);
      await loadDeliveries();
    } catch (err) {
      setError(err.message || 'Failed to update delivery status.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Delivery Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Assign delivery drivers and update live delivery statuses for orders.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDeliveries}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Order</th>
                <th className="p-4">Customer / Address</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Loading deliveries...
                  </td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No deliveries found.
                  </td>
                </tr>
              ) : (
                deliveries.map((del) => {
                  const orderId = del.orderId || del.order_id || del.id;
                  const orderCode = del.orderNumber || del.order_number || `Order #${orderId}`;
                  const address =
                    del.deliveryAddress || del.delivery_address || del.address || '-';
                  const driverName =
                    del.driverName || del.driver_name || (del.driverId ? `Driver #${del.driverId}` : 'Unassigned');
                  const currentStatus = String(del.status || 'pending').toLowerCase();

                  return (
                    <tr key={del.id || orderId} className="hover:bg-gray-50/70">
                      <td className="p-4 font-bold text-gray-900">{orderCode}</td>
                      <td className="p-4 text-gray-600">{address}</td>
                      <td className="p-4 font-semibold">{driverName}</td>
                      <td className="p-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(del, e.target.value)}
                          className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold capitalize outline-none"
                        >
                          {DELIVERY_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => openAssignModal(del)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Assign Driver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {assignTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100">
              <h3 className="font-extrabold uppercase">Assign Delivery Driver</h3>
              <button type="button" onClick={() => setAssignTarget(null)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">DRIVER</label>
                <select
                  required
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((drv) => (
                    <option key={drv.id} value={drv.id}>
                      {drv.name || drv.fullName || drv.full_name || `Driver #${drv.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">ESTIMATED TIME (MINS)</label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAssignTarget(null)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Assigning...' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, PhoneCall, Clock, ReceiptText, Truck, Tag } from 'lucide-react';
import settingsService from '../../services/settingsService';

const FAQ = [
  {
    q: 'How do I check on my order?',
    a: 'Open My Orders to see every order and its status, or Track Order for live progress of the current one.',
    to: '/customer/orders',
    icon: ReceiptText,
  },
  {
    q: 'Where is my delivery?',
    a: 'Track Order shows when your order is being prepared, ready, and out for delivery.',
    to: '/customer/track-order',
    icon: Truck,
  },
  {
    q: 'How do I use a promo code?',
    a: 'Active codes are listed on the Offers page. Type the code in the promo box at checkout.',
    to: '/customer/offers',
    icon: Tag,
  },
];

const trimTime = (t) => (t ? String(t).slice(0, 5) : '');

export default function HelpSupport() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    settingsService
      .getPublicSettings()
      .then((data) => {
        if (active) setInfo(data || null);
      })
      .catch(() => {
        if (active) setInfo(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const hours =
    info?.openingTime && info?.closingTime
      ? `${trimTime(info.openingTime)} – ${trimTime(info.closingTime)}`
      : null;

  const contacts = [
    { icon: PhoneCall, title: 'Call us', value: info?.phone, href: info?.phone ? `tel:${info.phone}` : null },
    { icon: Mail, title: 'Email us', value: info?.supportEmail, href: info?.supportEmail ? `mailto:${info.supportEmail}` : null },
    { icon: MapPin, title: 'Visit us', value: info?.address },
    { icon: Clock, title: 'Opening hours', value: hours },
  ].filter((c) => c.value);

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto font-sans">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
        <p className="text-xs text-gray-400">
          {info?.restaurantName ? `Get in touch with ${info.restaurantName}` : 'Get in touch with the restaurant'}
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-2xl border text-center text-xs text-gray-400">Loading contact details...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl border text-center text-xs text-gray-500 font-semibold">
          Contact details have not been set up yet. Please ask a staff member for help.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="bg-white p-5 rounded-2xl border text-center space-y-2">
              <Icon size={24} className="mx-auto text-green-600" />
              <h3 className="font-bold text-xs">{title}</h3>
              {href ? (
                <a href={href} className="text-xs text-emerald-700 hover:underline break-all">
                  {value}
                </a>
              ) : (
                <p className="text-xs text-gray-500">{value}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-5 rounded-2xl border space-y-3">
        <h2 className="font-bold text-sm text-gray-900">Common questions</h2>
        {FAQ.map(({ q, a, to, icon: Icon }) => (
          <div key={q} className="flex items-start gap-3 py-2 border-t first:border-t-0">
            <Icon className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-gray-900">{q}</p>
              <p className="text-gray-500">
                {a}{' '}
                <Link to={to} className="text-emerald-700 font-semibold hover:underline">
                  Open
                </Link>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

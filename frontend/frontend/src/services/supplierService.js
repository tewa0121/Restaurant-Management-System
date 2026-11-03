export const supplierService = {
  getSuppliers: async () => {
    return JSON.parse(localStorage.getItem('restaurantSuppliers') || JSON.stringify([
      { id: 1, name: 'Fresh Produce Co.', contact: '+1 555-0192', category: 'Vegetables' },
      { id: 2, name: 'Quality Meats Ltd.', contact: '+1 555-0144', category: 'Meat & Poultry' },
    ]));
  }
};
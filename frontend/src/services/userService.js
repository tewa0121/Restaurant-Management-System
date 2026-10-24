export const userService = {
  getUsers: async () => {
    return JSON.parse(localStorage.getItem('restaurantUsers') || JSON.stringify([
      { id: 1, name: 'John Manager', role: 'Manager', email: 'manager@resto.com', status: 'Active' },
      { id: 2, name: 'Alice Cashier', role: 'Cashier', email: 'cashier@resto.com', status: 'Active' },
      { id: 3, name: 'Chef Gordon', role: 'Kitchen Staff', email: 'chef@resto.com', status: 'Active' },
    ]));
  },
  addUser: async (user) => {
    const users = await userService.getUsers();
    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('restaurantUsers', JSON.stringify(users));
    return newUser;
  }
};
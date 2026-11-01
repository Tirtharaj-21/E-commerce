import all_product from "../Components/Assets/all_product";

const readData = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getAddresses = () =>
  readData("shopper_addresses", [
    {
      id: 1,
      label: "Home",
      fullName: "Demo Customer",
      phone: "9876543210",
      addressLine: "12 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016",
      isDefault: true,
    },
  ]);

export const saveAddresses = (addresses) =>
  saveData("shopper_addresses", addresses);

export const getOrders = () => readData("shopper_orders", []);
export const saveOrders = (orders) => saveData("shopper_orders", orders);

export const getWishlist = () => readData("shopper_wishlist", []);
export const saveWishlist = (ids) => saveData("shopper_wishlist", ids);

export const getProfile = (user) =>
  readData("shopper_profile", {
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

export const saveProfile = (profile) => saveData("shopper_profile", profile);

export { all_product };

import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { cart } = useContext(CartContext); 
  const { user, logout } = useContext(AuthContext);

  const totalItemsInCart = Array.isArray(cart) 
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0) 
    : 0;

  useEffect(() => {
    console.log("Cart data updated:", cart);
    console.log("Total items in cart:", totalItemsInCart);
  }, [cart]);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.logo1} className="w-36" alt="Logo" />
      </Link>

      {/* Menu Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {[
          { to: "/", label: "Homepage" },
          { to: "/eyeglasses", label: "Eye Glasses" },
          { to: "/sunglasses", label: "Sun Glasses" },
          { to: "/lens", label: "Lenses" },
          { to: "/accessories", label: "Accessories" },
          { to: "/about", label: "About" },
        ].map(({ to, label }) => (
          <NavLink key={to} to={to} className="flex flex-col items-center gap-1">
            {({ isActive }) => (
              <>
                <p className={isActive ? "text-black font-semibold" : ""}>{label}</p>
                <hr className={`w-2/4 h-[1.5px] ${isActive ? "bg-gray-700" : "bg-transparent"}`} />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      {/* User & Cart Icons */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="group relative">
            <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="Profile" />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <Link to="/myprofile" className="cursor-pointer hover:text-black">My Profile</Link>
                <Link to="/myorders" className="cursor-pointer hover:text-black">My Orders</Link>
                <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-sm text-gray-700 hover:text-black">Login</Link>
            <Link to="/signup" className="text-sm text-gray-700 hover:text-black">Sign Up</Link>
          </div>
        )}

        {user && cart && (
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            {totalItemsInCart > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                {totalItemsInCart}
              </span>
            )}
          </Link>
        )}

        <img onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="Menu" />
      </div>
    </div>
  );
};

export default Navbar;

// admin/frontend/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="bg-gray-900 text-white p-4 flex gap-4">
      <Link to="/admin/collections" className="hover:underline">Collections</Link>
      <Link to="/admin/users" className="hover:underline">Users</Link>
      <Link to="/admin/medicines" className="hover:underline">Medicines</Link>
    </div>
  );
}

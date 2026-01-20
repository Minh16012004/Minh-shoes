export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
        <h1 className="text-xl font-bold text-blue-600">
          Minh Shoes t
        </h1>

        <nav className="space-x-4">
          <a href="/" className="text-gray-600 hover:text-blue-600">
            Trang chủ
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Đăng nhập
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600">
            Đăng ký
          </a>
        </nav>
      </div>
    </header>
  )
}

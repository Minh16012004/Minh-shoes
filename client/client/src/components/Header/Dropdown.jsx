const Dropdown = ({ items }) => {
  return (
    <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg min-w-[220px] z-50">
      {items.map((item, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default Dropdown

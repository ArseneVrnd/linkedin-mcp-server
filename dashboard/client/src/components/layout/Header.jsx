import ThemeToggle from '../ui/ThemeToggle';

export default function Header({ title, dark, toggle, children }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        {children}
        <ThemeToggle dark={dark} toggle={toggle} />
      </div>
    </header>
  );
}

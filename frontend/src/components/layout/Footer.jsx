const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            N
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">NovaPost</span>
          <span className="text-zinc-400 dark:text-zinc-500">— Modern Editorial & Stories</span>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          &copy; {new Date().getFullYear()} NovaPost. Crafted for readers and writers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

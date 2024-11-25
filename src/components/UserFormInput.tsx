"use client";

export default function UserFormInput({
  inputHint,
  inputValue,
  handleValueChange,
  errors,
}) {
  const listItems = errors.map((err) => (
    <li className="flex items-center" key={err.message}>
      <span
        className={`mr-2 flex items-center justify-center h-5 w-5 rounded-full bg-slate-600 ${err.show ? "text-red-500" : "text-green-500"}`}
      >
        {err.show ? "✗" : "✓"}
      </span>
      {err.message}
    </li>
  ));

  return (
    <div className="pb-5">
      <input
        type="text"
        placeholder={inputHint}
        value={inputValue}
        onChange={handleValueChange}
        className="w-full placeholder:text-slate-600 text-black rounded-md h-8 pl-2"
      />
      <div className={`${errors.some((e) => e.show) ? "block" : "hidden"}`}>
        <ul className="mt-2 text-sm text-slate-400 space-y-1">{listItems}</ul>
      </div>
    </div>
  );
}

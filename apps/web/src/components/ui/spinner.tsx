export function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
      <title>Loading...</title>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

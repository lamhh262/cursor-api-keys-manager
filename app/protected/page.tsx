export default function Protected() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-semibold mb-4">Protected Content</h1>
          <p className="text-gray-600 dark:text-gray-300">
            This is a protected page that can only be accessed with a valid API key.
          </p>
        </div>
      </div>
    </div>
  );
}

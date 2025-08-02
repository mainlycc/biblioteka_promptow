export default function FilmowePromptyPage() {
  return (
    <main className="flex-1 p-8 pt-4">
      <h1 className="text-2xl font-bold mb-4">Prompty filmowe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tutaj możesz dodać prompty filmowe */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">VEO3 lub Halio</h3>
          <p className="text-gray-600 mb-4">
            Prompty do generowania filmów za pomocą VEO3 lub Halio.
          </p>
          <div className="text-sm text-gray-500">
            Wkrótce dostępne prompty...
          </div>
        </div>
      </div>
    </main>
  )
} 
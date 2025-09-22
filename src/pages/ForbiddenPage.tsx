const ForbiddenPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="text-gray-600 mt-2">Anda tidak punya akses ke halaman ini.</p>
    </div>
  );
};

export default ForbiddenPage;

function Error() {
    return (
        <div className="flex-1 flex flex-col justify-center bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">404</p>
                <h1 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
                    Page not found
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <a
                    href="/"
                    className="mt-8 inline-block rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                    Go back home
                </a>
            </div>
        </div>
    );
}

export default Error;

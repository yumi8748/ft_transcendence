var contentDiv = document.getElementById('content');

function displayHome() {
    contentDiv.innerHTML = `
	<div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
		<div class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
	</div>
	<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-46">
		<div class="text-center">
			<h1 class="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">Welcome to the Pong Game!</h1>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<a id="get-started-btn" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Get started</a>
			</div>
		</div>
	</div>
	<div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
		<div class="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
		</div>
	</div>`;


		// console.log("OKOKOKO")
		const token = localStorage.getItem('token');
		console.log("token is:", token);
		const name = localStorage.getItem('name');
		console.log("name is:", name);
    document.getElementById('get-started-btn').addEventListener('click', () => {
        const token = localStorage.getItem('token');
		console.log("token is:", token);
        if (token) {
            window.location.href = '/game';
        } else {
            window.location.href = '/login';
        }
    });
}

// async function displayHome()
// {
   
//    const res = await fetch('/verify')
//    const data = await res.json()
//    if (data.authenticated) {
//        contentDiv.innerHTML = `<h2>Welcome to the Home Page ${data.user}!</h2>`;
//    } else {
//    // //   showLogin()
//        contentDiv.innerHTML = `<h2>Welcome to the Home Page!</h2>`;

//    }
// }

export default displayHome;
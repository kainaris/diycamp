// Navigate to a "new page" by updating the URL and rendering content
function navigate(page) {
	// Update the URL without reloading the page
	history.pushState({ page }, `${page}`, `#${page}`);

	// Render the content for the new page
	renderPage(page);
}

// Render content based on the page identifier
function renderPage(page) {
	if (page === 'home') {
		generateHome()
	} else {
		const character = data.characters.find(c => c.id === page);
		if (character) {
			generateCharacterHTML(character)
		} else {
			content.innerHTML = `<h1>404</h1><p>Page not found.</p>`;
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {






	// Handle browser navigation (back/forward buttons)
	window.addEventListener('popstate', (event) => {
		const page = event.state?.page || 'home'; // Default to home if no state
		renderPage(page);
	});

	// Load the correct page on initial load based on the URL
	document.addEventListener('DOMContentLoaded', () => {
		const initialPage = location.hash.replace('#', '') || 'home';
		renderPage(initialPage);
	});







	document.querySelectorAll('#image-container').forEach(container => {
		const selectedImage = container.querySelector('#selected-image img');
		const galleryImages = container.querySelectorAll('#image-gallery img');

		galleryImages.forEach(image => {
			image.addEventListener('click', () => {
				console.log('clicked')
				// Update the selected image within this container
				selectedImage.src = image.src;

				// Remove 'selected' class from all thumbnails in this container
				galleryImages.forEach(img => img.classList.remove('selected'));

				// Add 'selected' class to the clicked thumbnail
				image.classList.add('selected');
			});
		});
	});
})

async function generateCharacterHTML(character) {
	const mainElement = document.querySelector('main');
	mainElement.innerHTML = ''; // Clear previous content

	const charDiv = document.createElement('div');
	charDiv.id = character.id;
	charDiv.className = 'row bigger-gap';

	// Rows for content
	const contentDiv = document.createElement('div');
	contentDiv.className = 'bg';
	character.content.forEach(contentPart => {
		let contentPartDiv;
		if (contentPart.type === 'title') {
			contentPartDiv = document.createElement('h1');
		} else {
			contentPartDiv = document.createElement('p');
		}
		contentPartDiv.textContent = `${contentPart.text}`;
		contentDiv.appendChild(contentPartDiv);
	})
	charDiv.appendChild(contentDiv);

	// Rows for infobox
	const infoBoxDiv = document.createElement('div');
	infoBoxDiv.className = 'column narrow-column bg';

	// Title
	const titleDiv = document.createElement('div');
	titleDiv.className = 'title';
	titleDiv.textContent = character.name;
	infoBoxDiv.appendChild(titleDiv);

	// Image Container
	const imageContainer = document.createElement('div');
	imageContainer.id = 'image-container';

	const selectedImage = document.createElement('div');
	selectedImage.id = 'selected-image';
	const selectedImg = document.createElement('img');
	selectedImg.src = `images/${character.id}/${character.id}1.png`; // Default to the first image
	selectedImg.alt = `${character.id}1`;
	selectedImage.appendChild(selectedImg);
	imageContainer.appendChild(selectedImage);

	const imageGallery = document.createElement('div');
	imageGallery.id = 'image-gallery';

	// Dynamically fetch images
	let imageIndex = 1;
	while (true) {
		const imgPath = `images/${character.id}/${character.id}${imageIndex}.png`;
		const img = new Image();
		img.src = imgPath;
		img.alt = `${character.id}${imageIndex}`;

		try {
			await new Promise((resolve, reject) => {
				img.onload = () => resolve(); // Image successfully loaded
				img.onerror = () => reject(); // Image failed to load
			});

			img.onclick = () => {
				// Update the selected image within this container
				selectedImg.src = img.src;

				// Find the parent image-gallery and remove 'selected' class from its children
				const gallery = img.closest('#image-gallery');
				gallery.querySelectorAll('img').forEach(img => img.classList.remove('selected'));

				// Add 'selected' class to the clicked thumbnail
				img.classList.add('selected');
			};


			imageGallery.appendChild(img); // Append only if successfully loaded
			imageIndex++;
		} catch {
			break; // Stop the loop when an image fails to load
		}
	}
	imageContainer.appendChild(imageGallery);
	infoBoxDiv.appendChild(imageContainer);

	// Infobox details
	const infobox = character.infobox[0];
	for (const [key, value] of Object.entries(infobox)) {
		const columnDiv = document.createElement('div');
		columnDiv.className = 'row';

		const labelDiv = document.createElement('div');
		labelDiv.textContent = `${key}:`;
		columnDiv.appendChild(labelDiv);

		const valueDiv = document.createElement('div');
		if (Array.isArray(value)) {
			valueDiv.innerHTML = value.join('<br>');
		} else {
			valueDiv.textContent = value;
		}
		columnDiv.appendChild(valueDiv);

		infoBoxDiv.appendChild(columnDiv);
	}

	charDiv.appendChild(infoBoxDiv);
	mainElement.appendChild(charDiv);
}

function generateHome() {
	const mainElement = document.querySelector('main');
	mainElement.innerHTML = ''; // Clear previous content

	const homeDiv = document.createElement('div');
	homeDiv.id = 'home';
	homeDiv.className = 'bg';

	{
		{
			const section = document.createElement('h1');
			section.textContent = 'HOME';
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('p');
			section.textContent = 'The server was approximately created on 11/09/2024'
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('p');
			section.textContent = 'Stylus, Crayon Box and Spray Paint are the 3 hosts!\nThey\'re like a family, Stylus (25) taking care of SP (17) and CB (11).'
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('p');
			section.textContent = 'The hosts:';
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('div');
			section.className = 'row fixed-wdith';
		
			// Generate buttons for characters with the role "Host"
			const hosts = data.characters.filter(character => {
				return character.infobox.some(info => info.Role === 'Host');
			});
			hosts.forEach(character => renderCharacterButton(section, character));
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('p');
			section.textContent = 'The NPCs:';
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('div');
			section.className = 'row fixed-wdith';
		
			// Generate buttons for characters with the role "NPC"
			const npcs = data.characters.filter(character => {
				return character.infobox.some(info => info.Role === 'NPC');
			});
			npcs.forEach(character => renderCharacterButton(section, character));
			homeDiv.appendChild(section);
		}
		{
			const section = document.createElement('p');
			section.textContent = 'The contestants:';
			homeDiv.appendChild(section);
		}
	}

	// Append the dynamically generated content to <main>
	mainElement.appendChild(homeDiv);
}

async function renderCharacterButton(buttonContainer, character) {
	const buttonWrapper = document.createElement('div'); // Wrapper to structure image and button
	buttonWrapper.className = 'column fixed-wdith';

	buttonWrapper.addEventListener('click', () => {
		navigate(character.id)
	});

	// Load the first image for the host
	const imgPath = `images/${character.id}/${character.id}1.png`;
	const img = new Image();
	img.src = imgPath;
	img.alt = `${character.name} image`;

	try {
		await new Promise((resolve, reject) => {
			img.onload = () => resolve(); // Image successfully loaded
			img.onerror = () => reject(); // Image failed to load
		});

		buttonWrapper.appendChild(img); // Append the image if it loads successfully
	} catch {
		console.warn(`Image not found for ${character.name}: ${imgPath}`);
		// Optionally, handle missing image (e.g., use a placeholder image or skip this host)
	}

	// Create the button
	const button = document.createElement('button');
	button.textContent = character.name; // Button label is the character's name
	button.dataset.characterId = character.id; // Associate button with character ID

	buttonWrapper.appendChild(button); // Append the button below the image
	buttonContainer.appendChild(buttonWrapper); // Add the buttonWrapper to the container
}
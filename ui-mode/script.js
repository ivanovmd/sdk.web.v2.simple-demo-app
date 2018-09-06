(() => {
    // get references to each image input
    const imageInputs = document.querySelectorAll('.image-source-input');

    // Initialize the Slyce SDK
    const slyce = new slyceSDK();
    // Initialize a Slyce Space. This is an asynchronous call which would get the config object for the given Space and register it in the SDK
    // In other words this call should be performed before any other actions could be taken 
    slyce.initSlyceSpace('slycedemo', 'L9VT1RPiWGBFgHEAH7hgFGeDnZgdBPWL5aCT3zH0JZ0', 'DiiCp2Y2hLyEwggtX4km84');

    // Register a Rivets formatter
    rivets.formatters.length = (arr) => arr.length;

    // An object that would be bound to the UI, changing any of these properties would result in UI rerendering
    let viewModel = {
        errors: [],
        results: [],
        showResults: false,
        // rivets would pass event and reference to the clicked item
        findSimilar: function(e, binding) {
            // findSimilar accepts dataset ID against which the search should happen
            // the 2nd argument should be item ID, although it can be null
            // the 3rd argument is optional, but if you didn't pass the item ID the 3rd argument should be the item image URL
            // so thus either item ID or item image URL should be passed, or both
            // the 4th argument is optional. It's the settings obj. Please check the docs for reference
            slyce.findSimilar('JKu34SQSxP5PWkaUMXE5w7', binding.item.id, binding.item.image_link, {})
                .then(response => {
                    console.log(response.results[0].items);
                    viewModel.results = response.results[0].items;
                });
        }
    }
    // Bind the object to the page
    rivets.bind(document.getElementById('wrapper'), viewModel);

    // Loop through the input elements and bind event handlers
    imageInputs.forEach((imageInput) => {
        imageInput.addEventListener('change', (e) => {
            // Fetch the File object from input
            const imageFile = e.target.files[0];
            
            if (imageFile) {
                resetViewModel();

                // Execute the worflow using the image File, and WorkflowId (in this case Universal Workflow)
                slyce.executeWorkflow(imageFile, '8qHmYrvaaVyUyWQMifN2o8', {
                    // This is going to be fired each time the task was updated
                    onTaskUpdated: (message) => {
                        console.log('message: ', message);
                    },
                    // This is going to be fired if the workflow has been completed or an error has appeared during the execution
                    onTaskCompleted: (message, errors) => {
                        viewModel.showResults = true;
                        viewModel.errors = errors;
                        console.log('errors: ', errors);
                        console.log('message: ', message);

                        if (message && message.results) {
                            // Result Items 
                            console.log('items: ', message.results[0].items);
                            viewModel.results = message.results[0].items;
                        }
                    }
                }, true);     
            } else {
                console.log('no file provided');
            }
        });
    });

    // Go back to the initial View state
    const resetViewModel = () => {
        viewModel.results = [];
        viewModel.errors = [];
        viewModel.showResults = false;
    }
})();



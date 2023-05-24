window.onload = function() {
    // Get a reference to the icon container div
    var iconContainer = document.querySelector('.iconcontainer');

    // Set up a click event listener on the icon container
    iconContainer.addEventListener('click', function(e) {
        // If an icon div was clicked...
        if (e.target && e.target.matches('div[data-icon]')) {
            // ...set the value of the hidden icon input field to the data-icon attribute of the clicked div
            document.querySelector('#icon').value = e.target.getAttribute('data-icon');
        }
    });
}

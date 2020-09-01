function scrapeValue() {
                // var search = document.querySelector('input');
                // var searchForm = document.querySelector('form');
                var searchForm = document.getElementById("searchForm");
                function handleForm(event) { event.preventDefault(); }
                searchForm.addEventListener('submit', handleForm);
                var searchElement = document.getElementById("searchElement");
                var productGrid = document.getElementById('productGrid');

                searchForm.onsubmit = function() {
                    var searchValue = searchElement.value;
                    console.log(searchValue);
                    updateDisplay(searchValue);
                };

                function updateDisplay(searchValue) {
                searchValue = searchValue.replace(new RegExp(" ", "g"), "+");
                searchValue = searchValue.toLowerCase();
                var url = 'https://cse-server.vercel.app/s?search=' + searchValue;

                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'text';

                request.onload = function() {
                  // productGrid.textContent = request.response;
                  productGrid.innerHTML = request.response;
                };

                request.send();
                };

                // updateDisplay('Verse 1');
                // search.value = 'Verse 1';
                // console.log(search.value);
            }
            
            scrapeValue();
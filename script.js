window.onload = function () {
    // get data
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "data.json", false);
    rawFile.send(null);
    // parse json and sort it by latest
    var allText = rawFile.responseText;
    var parsed = JSON.parse(allText);
    parsed.sort(function (a, b) { return b.Episode - a.Episode });
    // set up table 
    var header = "<div class='row'>";
    var closer = "</div>";
    // check for url parameter
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const url_search = urlParams.get('q')
    // set up search
    const search = document.getElementById("search");
    let search_term = "";
    // set it to parameter if passed in
    if (url_search != null) {
        search_term = url_search;
        search.value = search_term;
    }
    // set up colors
    let styles = [
        {
            // pinkish
            "background": "#e0d4e4",
            "notes": "#f9c1d9",
            "title": "#ef6592"
        },
        {
            // greenish
            "background": "#c3c44f",
            "notes": "#79a467",
            "title": "#4b8969"
        },
        {
            // light blue
            "background": "#f0d4d8",
            "notes": "#889cc1",
            "title": "#4b79a6"
        },
        {
            // like the sea
            "background": "#b0bfe5",
            "notes": "#54a7b5",
            "title": "#3b9691"
        },
        {
            // green on green 
            "background": "#7fc6a8",
            "notes": "#ace3dd",
            "title": "#b7d6df"
        },
    ]

    var selected_style = styles[Math.floor(Math.random() * styles.length)];
    // Functions

    // listen for input on a timer
    let timer;
    const waitTime = 200;
    search.addEventListener('input', (e) => {
        const text = e.currentTarget.value;
        clearTimeout(timer);
        timer = setTimeout(() => {
            search_term = text;
            urlParams.set('q', search_term);
            history.replaceState({}, "Uhh Yeah Notes Search", "?" + urlParams.toString());
            if (search_term == null || search_term == "") {
                history.replaceState({}, "Uhh Yeah Notes Search", "/");
            }
            showList();
        }, waitTime);
    });

    // set up button onclick
    document.getElementById("search_order").onclick = function()
    {
        var current = document.getElementById("search_order");
        if (current.innerHTML == "Latest") {
            parsed.sort(function (a, b) { return a.Episode - b.Episode });
            current.innerHTML = "Earliest";
        }
        else {
            parsed.sort(function (a, b) { return b.Episode - a.Episode });
            current.innerHTML = "Latest";
        }
        showList();
    }

    // filter list and highlight if search term, otherwise show entire list
    var mark = '<mark class="background">$&</mark>';
    const showList = () => {
        document.innerHTML = "";
        content = "";
        var baselink = "<a target='_blank' style='color:black' href='https://uhhyeahdude.com/index.php/show_notes/episode_";
        var reg = new RegExp(search_term, 'gi');
        if (search_term != "") {
            parsed
                .filter((item) => {
                    return (
                        item.Title.toLowerCase().includes(search_term) || item.Note.toLowerCase().includes(search_term)
                    );
                })
                .forEach((e) => {
                    content = content + createrow(baselink + e.Episode + "''>" + e.Episode + "</a>", e.Date, e.Title.replace(reg, mark), e.Note.replace(reg, mark))
                });
        }
        else {
            parsed
                .forEach((e) => {
                    content = content + createrow(baselink + e.Episode + "''>" + e.Episode + "</a>", e.Date, e.Title, e.Note)
                });
        }
        document.getElementById("table").innerHTML = header + content + closer;

        // reapply selected color because the css gets reset.
        //fix this later
        setcolors();

    };

    // create row from data
    function createrow(ep, date, title, note) {
        return "<hr class='solid'><div class='column left'>" + ep + "</div>"
            + "<div class='column center'>" + date + "</div>"
            + "<div class='column right notesbackground'><b>"
            + "<span style='font-size:22px'>" + title + "</span>"
            + "</b><br><br>" + note
            + "<br><br></div></hr>"
    }

    function setcolors() {
        document.querySelector('.titlecolor').style.color = selected_style.title;
        document.querySelectorAll('.background').forEach(el => { el.style.backgroundColor = selected_style.background; });
        document.querySelectorAll(".notesbackground").forEach(el => { el.style.backgroundColor = selected_style.notes; });
    }

    // load the list
    showList();
}

$(document).ready(function() {
  let fire_base_url = "https://to-do-list-25483.firebaseio.com";
  let box_top = ` <div class="box">
                    <article class="media">
                        <div class="media-content">
							<div class="content">
                <p>`;

  let box_middle = `</p>
                </div>
              </div>
            <div class="media-right">`;

  let box_bottom = `</div>
				</article>
			</div>
		</li>`;

  $(document).keypress(event => {
    let keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      if ($("#to-do-input").val() != "") {
        // Appends the new to do item when posting to the database. POST
        fetch(`${fire_base_url}/to-dos.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            is_completed: false,
            title: $("#to-do-input").val()
          })
        })
          .then(response => {
            return response.json();
          })
          .then(response => {
            let new_item = box_top + $("#to-do-input").val() + box_middle;
            new_item += `<div class="danger button is-danger is-small" data-id=${response.name}>Delete</div>`;
            new_item += box_bottom;

            $("#to-do-items").append(new_item);
            $("#to-do-input").val("");

            remove_items();
          });
      }
    }
  });

  // Appends all of the to do list items when page loads. GET
  fetch(`${fire_base_url}/to-dos.json`)
    .then(response => {
      return response.json();
    })
    .then(response => {
      for (let to_do in response) {
        console.log(response);
        let new_item = box_top + response[to_do].title + box_middle;
        new_item += `<div class="danger button is-danger is-small" data-id=${to_do}>Delete</div>`;
        new_item += box_bottom;
        $("#to-do-items").append(new_item);
        remove_items();
      }
    });
});

const remove_items = () => {
  let fire_base_url = "https://to-do-list-25483.firebaseio.com";
  // Deletes a to do from firebase DELETE
  $(".danger").click(function() {
    let target_id = $(this).data("id");
    fetch(`${fire_base_url}/to-dos/${target_id}.json`, {
      method: "DELETE"
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        $(this)
          .parent()
          .parent()
          .parent()
          .remove();
      });
  });
};

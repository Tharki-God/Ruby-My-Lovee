/* eslint-disable no-undef */
 $(document).ready(() => {   
      $.get("/api/commands", (data) => {
        //same as above check it :eyes:
		/*<details>
		  <summary>Management Commands</summary>
                                                   <div class="faq__content">
	</div>
                                                 </details>*/
												 let fun = [];
												 let misc = [];
												 let music = [];
												 let filter = [];
												 let admin = [];
												 let info = [];
        data.commands.forEach((cmd) => {
			if (cmd.level === "Music") {
				music.push(cmd);
          $("#music-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}
	if (cmd.level === "Info") {
		info.push(cmd);
          $("#info-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}
		if (cmd.level === "Admin") {
			admin.push(cmd);
          $("#admin-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}
		if (cmd.level === "Filters") {
			filter.push(cmd);
          $("#filter-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}
		if (cmd.level === "Fun") {
			fun.push(cmd);
          $("#fun-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}
		if (cmd.level === "Misc") {
			misc.push(cmd);
          $("#misc-commands-body").append(`
<tr>
  <th scope="row">${cmd.name}</th>
  <td>${cmd.aliases ? cmd.aliases.slice(0, 2).join(", ") : "None"}</td>
  <td>${cmd.usage ? cmd.usage : "None"}</td>
  <td>${cmd.description ? cmd.description : "None"}</td>
</tr>

`);
		}});
		if (fun.length === 0) {$("details").remove(".fun");}
		if (misc.length === 0) {$("details").remove(".misc");}
		if (info.length === 0) {$("details").remove(".info");}
		if (filter.length === 0) {$("details").remove(".filter");}
		if (admin.length === 0) {$("details").remove(".admin");}
		if (music.length === 0) {$("details").remove(".music");}
      });
    });
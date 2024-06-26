import { ajax } from "rxjs/ajax";
import { interval, take, catchError, of } from "rxjs";

export default class Message {
  constructor() {
    this.page = document.querySelector("#root");
  }

  init() {
    this.addBlock(this.page);
    this.items = this.page.querySelector(".box_items");
    this.reception();
  }

  addBlock(page) {
    const box = document.createElement("div");
    box.classList.add("box");
    const boxTitle = document.createElement("h2");
    boxTitle.classList.add("box_title");
    boxTitle.textContent = "Incoming messages...";
    const boxItems = document.createElement("div");
    boxItems.classList.add("box_items");
    box.append(boxTitle);
    box.append(boxItems);
    page.append(box);
  }

  addMessege(page, name, text, data) {
    const itemBox = document.createElement("div");
    itemBox.classList.add("item");
    const itemName = document.createElement("p");
    itemName.classList.add("item_name");
    itemName.textContent = name;
    const itemText = document.createElement("p");
    itemText.classList.add("item_text");
    itemText.textContent = text;
    const itemData = document.createElement("p");
    itemData.classList.add("item_data");
    itemData.textContent = data;
    itemBox.append(itemName);
    itemBox.append(itemText);
    itemBox.append(itemData);
    page.prepend(itemBox);
  }

  reception() {
    const numb = interval(1000).pipe(take(7));
    const mess = numb.subscribe(() => {
      const obj$ = ajax
        .getJSON("https://rx-back.onrender.com/messages/unread")
        .pipe(
          catchError((error) => {
            console.log("error: ", error);
            return of(error);
          })
        );
      obj$.subscribe((response) => {
        let text;
        if (response.subject.length >= 15) {
          text = response.subject.slice(0, 15) + "...";
        }

        this.addMessege(this.items, response.from, text, response.received);
      });
    });
  }
}

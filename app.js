const form = document.querySelector('#add-cafe-form');
const cafeList = document.querySelector('#cafe-list');

const addCafe = (doc) => {
    let li = document.createElement('li');
    li.innerHTML = `<span>${doc.data().name}</span>
                    <span>${doc.data().city}</span>
                    <div onclick='handleX.call(this)'>x</div>`;
    li.setAttribute('data-id', doc.id)
    cafeList.appendChild(li);
}

function handleX() {
    let id = this.parentNode.dataset.id;
    db.collection('cafes').doc(id).delete()
}

form.onsubmit = function (e) {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = form.city.value = '';
}

db.collection('cafes').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            addCafe(change.doc);
        } else if (change.type === 'modified') {
            let li = document.querySelector(`li[data-id="${change.doc.id}"]`);
            li.querySelector('span:first-of-type').textContent = change.doc.data().name;
            li.querySelector('span:last-of-type').textContent = change.doc.data().city;
        } else if (change.type === 'removed') {
            document.querySelector(`li[data-id="${change.doc.id}"]`).remove();
        }
    })
})
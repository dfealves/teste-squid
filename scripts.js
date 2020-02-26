const API_URL = "https://vision.squidit.com.br/v1/feed/test?count=50";
const container = document.querySelector(".container");
const load = document.querySelector("#load");

function setLoading(loading = true) {
  if (loading === true) {
    let loadingEl = document.createElement("h3");

    loadingEl.setAttribute("id", "loading");
    container.appendChild(loadingEl);
  } else {
    document.getElementById("loading").remove();
  }
}

//Primeira consulta da API
search(API_URL).then(showData);
//Função para buscar API
function search(val) {
  return fetch(val)
    .then(setLoading())
    .then(data => data.json().then(setLoading(false)));
}

//Função para carregar mais conteudo
function loadMore(url) {
  search(API_URL + "&nextUrl=" + encodeURIComponent(url))
    .then(setLoading())
    .then(showData)
    .then(setLoading(false));
}

function showData({ medias, pagination }) {
  medias.map(element => {
    const { criadoEm, upvotes, comentarios, imagens, usuario } = element;

    //desestruturando o objeto para capturar apenas os dados que serão utilizados

    const postWrapper = document.createElement("div");
    postWrapper.classList.add("post-wrapper");

    const postImage = document.createElement("img");
    postImage.classList.add("post-img");
    postImage.setAttribute("src", imagens.resolucaoPadrao.url);

    const postsSection = document.createElement("section");
    postsSection.classList.add("posts-section");

    const postInfo = document.createElement("div");
    postInfo.classList.add("post-info");

    const { username } = usuario;
    const userInfo = [username, upvotes, comentarios, criadoEm];

    userInfo.map(item => {
      const postItem = document.createElement("p");
      postItem.classList.add("item");
      userInfo[0].innerHTML = "@";
      postItem.innerHTML = item;

      postInfo.appendChild(postItem);
    });

    postWrapper.appendChild(postImage);
    postWrapper.appendChild(postInfo);

    container.appendChild(postWrapper);
  });

  $(window).scroll(function() {
    if ($(document).height() - $(this).height() == $(this).scrollTop()) {
      loadMore(pagination.next_url);
    }
  });
}

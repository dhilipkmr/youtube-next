console.log('hi');

function NextVideoPlayer() {

}

NextVideoPlayer.prototype.addPlayNextButton = function() {
  document.querySelectorAll('ytd-compact-video-renderer').forEach(($videoCard, index) => {
    const textATag = $videoCard.querySelectorAll('a:not(.ytd-thumbnail)')[0];
    const currHref = textATag.href;
    textATag.href = 'javascript:void(0)';
  
    const span = document.createElement('span');
    span.innerText = 'Play Next';
    span.id = 'playNextBtn';
    span.setAttribute('data-videoId', index);
    span.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.handlePlayNextClick(e, currHref, $videoCard)
    });
  
    const parentElt = textATag.querySelector('#metadata-line');
    parentElt.append(span);
  });  
}

NextVideoPlayer.prototype.handlePlayNextClick = function(e, currHref, $videoCard) {
  this.nextPlayBtn = e.target;
  this.selectedhref.push({href: currHref, name: $videoCard.querySelector('#video-title').innerText });
  if (!this.listeningToEndOfVideo) {
    this.checkforEndOfVideo();
  }
  if (!this.hasFloatingBar) {
    this.createFloatingBar($videoCard);
  }
  if (e.target.innerText === 'Play Next') {
    this.updateText(e.target);
  } else {
    this.removeFromQueue(e.target);
  }
}

NextVideoPlayer.prototype.createFloatingBar = function() {
  if (!this.hasFloatingBar) {
    this.$floatingBar = document.createElement('div');
    this.$floatingBar.classList.add("floatBar");
    this.$floatingBar.classList.add("hand");
    document.body.appendChild(this.$floatingBar);
  } 
  this.$floatingBar.innerHTML = 
    `<div class="pad5"><span class="white">Up Next: </span>
    <span class="grey ellipsis rel5">${this.selectedhref[0].name}</span>
    <svg enable-background="new 0 0 16 16" height="16px" id="Layer_1" version="1.1" viewBox="0 0 32 16" width="16px" xml:space="preserve"><path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="#515151"/></svg></div>`;
  this.$floatingBar.addEventListener('click', this.togglePlaylist.bind(this));
  this.hasFloatingBar = true;
}

NextVideoPlayer.prototype.updateText = function($target) {
  document.querySelectorAll('ytd-compact-video-renderer').forEach(($videoCard) => {
    const $span = $videoCard.querySelector('#metadata-line #playNextBtn');
    if ($span !== $target) {
      $span.innerText = 'Add to Queue';
    } else {
      $span.innerText = 'Playing Next';
    }
  });
}

NextVideoPlayer.prototype.togglePlaylist = function(e) {
  if (!this.floatbarExpand) {
    const $wrapper = document.createElement('div');
    $wrapper.id = 'wrapperPlaylist';
    $wrapper.innerHTML = this.selectedhref.map((item, index) => {
      const func = this.changeUrl.bind(this, item.href);
      return `<div class="pad5"><span class="white">${index + 1}. <a href=${item.href} class="grey ellipsis rel5 hoverunderline">${item.name}</a></span></div>`;
    }).join('');
    const $children = e.currentTarget.children[0];
    e.currentTarget.innerHTML = '';
    e.currentTarget.append($wrapper);
    e.currentTarget.append($children);
  } else {
    const $children = e.currentTarget.children[e.currentTarget.childElementCount - 1];
    e.currentTarget.innerHTML = '';
    e.currentTarget.append($children);
  }
  this.floatbarExpand = !this.floatbarExpand;
}

NextVideoPlayer.prototype.changeUrl = function(href) {
  window.location.href= href;
}
NextVideoPlayer.prototype.removeFromQueue = function($target) {
  $target.innerText = 'Added to Queue';
}

NextVideoPlayer.prototype.checkforEndOfVideo = function() {
  const $video = document.getElementsByTagName('video')[0];
  $video.addEventListener('ended', () => {
    if (this.selectedhref[0].href !== window.location.href) {
      localStorage.setItem('ytNext', JSON.stringify(this.selectedhref.slice(1)));
      window.location.href = this.selectedhref[0].href;
    } else {
      localStorage.removeItem('ytNext');
    }
  });
  this.listeningToEndOfVideo = true;
}

NextVideoPlayer.prototype.init = function() {
  this.selectedhref = localStorage.getItem('ytNext') ? JSON.parse(localStorage.getItem('ytNext')) : [];
  if (this.selectedhref.length > 0) {
    this.createFloatingBar();
    this.checkforEndOfVideo();
  }
  this.timeInterval = null;
  this.nextPlayBtn = null;
  this.listeningToEndOfVideo = false;
  this.$floatingBar = null;
  this.floatbarExpand = false;
  this.addPlayNextButton();
}

var nextPlayer = new NextVideoPlayer();
setTimeout(() => {
  nextPlayer.init();
}, 4000);
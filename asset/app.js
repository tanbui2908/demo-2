const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [

        {
            name: 'Nấu cho em',
            singer: 'Đen Vâu',
            path: './asset/music/nau-cho-em.mp3',
            img: './asset/img/nau-cho-em.jpg'
        },

        {
            name: 'Có em',
            singer: 'Madihu',
            path: './asset/music/co-em.mp3',
            img: './asset/img/co-em.jpg'
        },

        {
            name: 'Một triệu like',
            singer: 'Đen Vâu',
            path: './asset/music/mot-trieu-like.mp3',
            img: './asset/img/mot-triu-like.jpg'
        },

        {
            name: 'Head in the cloud',
            singer: 'The rock',
            path: './asset/music/head-in-the-clouds.mp3',
            img: './asset/img/head-in-the-clouds.jpg'
        },

        {
            name: 'Hãy trao cho anh',
            singer: 'Sơn Tùng',
            path: './asset/music/hay-chao-cho-anh.mp3',
            img: './asset/img/hay-chao-cho-anh.jpg'
        },


        {
            name: 'Nghe nhạc anh mỗi khi buồn',
            singer: 'Cover by Thịnh Suy',
            path: './asset/music/nghe-nhac-anh-moi-khi-uon.mp3',
            img: './asset/img/nghe-nhac-anh-khi-buon.jpg'
        }


    ],

    render: function () {
        const _this = this
        const htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${ index === _this.currentIndex ? "active" : " " }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        })
        playList.innerHTML = htmls.join('')
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        // sử lí quay cd
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // sử lý scroll
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }
        // sử lý play
        playBtn.onclick = () => {
            if(_this.isPlaying) {
                audio.pause()
            }else {
                audio.play()
            }
        }
        // khi được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khị bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // sử lí khi tua
        progress.onchange  = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next
        nextBtn.onclick = function(){
            if (_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev
        prevBtn.onclick = () => {
            if (_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
                audio.play()
                _this.render()
        }
        // random
        randomBtn.onclick = (e) => {
            _this.isRandom = ! _this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // sử lý next khi hết bài
        audio.onended = function () {
            if (_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // scroll ative song   
        
        // sử lý repeat
        repeatBtn.onclick = (e) => {
            _this.isRepeat = ! _this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // nắng nghe hành vi click vào playlists
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (
                songNode  ||  !e.target.closest('.option')
            ) {
                // sử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // sử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }


    },

    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center'
            })
        },300)
    },
        
    defineProperties: function () {
            Object.defineProperty(this, 'currentSong', {
                get: function () {
                    return this.songs[this.currentIndex]
                }
            })
    },
        
    loadCurrentSong: function () {
            heading.textContent = this.currentSong.name
            audio.src = this.currentSong.path
            cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
    },
        
    nextSong: function() {
        // khi next
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        // khi prev
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // định nghĩa các thuộc tính oject
        this.defineProperties()
        // nắng nghe / sử lý các sự kiện
        this.handleEvents()
        // load current song
        this.loadCurrentSong()
        // render raplaylist
        this.render()   
    }    
}

app.start()
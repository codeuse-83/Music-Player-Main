const range = document.querySelector('.range')
const title = document.querySelector('.title')
const author = document.querySelector('.author')
const img = document.querySelector('.img')
const currentTime = document.querySelector('.currentTime')
const duration = document.querySelector('.duration')
const progressBar = document.querySelector('.progressBar')
const progress = document.querySelector('.progress')
const progressBarSound = document.querySelector('.progressBarSound')
const btnPlay = document.querySelector('.btnPlay')
const btnPrevious = document.querySelector('.btnPrevious')
const btnNext = document.querySelector('.btnNext')
const soundIcon = document.querySelector('.bi-volume-up-fill')
const audioPlayer = document.querySelector('audio')
const iconPlay = document.querySelector('.bi-play-fill')
let songIndex = 0;

    const songs = [
        {
            title: 'I Dont Want A Lover',
            author: 'Texas',
            link: 'assets/songs/texas_i_dont_want_a_lover_live_Release.mp3',
            img: 'assets/img/texas.jpg'
        },
       
        {
            title: 'Paradis Inanime',
            author: 'Mylene farmer',
            link: 'assets/songs/Mylene_farmer_paradis_inanime_stade_de_france_live_clip_Release.mp3',
            img: 'assets/img/mylene.jpg'
        },
        {
            title: 'Start A Family',
            author: 'Texas',
            link: 'assets/songs/texas_start_a_family_Release.mp3',
            img: 'assets/img/texas-4.jpg'
        },
        {
            title: 'Lorloge',
            author: 'Mylene Farmer',
            link: 'assets/songs/lhorloge_mylene_farmer_live_2019_Release.mp3',
            img: 'assets/img/mylene.jpg'
        },
        {
            title: 'The Conversation',
            author: 'Texas',
            link: 'assets/songs/texas_the_conversation_Release.mp3',
            img: 'assets/img/texas-2.jpg'
        },
    ]
   

load(songs[songIndex])

function load (song) {
    const played = !audioPlayer.paused

    range.innerHTML = `${songIndex + 1} of ${songs.length}`
    title.innerHTML = song.title
    author.innerHTML = song.author
    audioPlayer.src = song.link
    img.style.background = `
            rgba(240, 221, 248, 0.2) 
            url(${song.img}) center/cover no-repeat`

    if (played) {
        audioPlayer.play()
    }
}

function playMusic () {
    iconPlay.classList.remove('bi-play-fill')
    btnPlay.classList.remove('pause')
    iconPlay.classList.add('bi-pause-fill')
    btnPlay.classList.add('play')
    audioPlayer.play()
}

function pauseMusic () {
    iconPlay.classList.remove('bi-pause-fill')
    btnPlay.classList.remove('play')
    iconPlay.classList.add('bi-play-fill')
    btnPlay.classList.add('pause')
    audioPlayer.pause()
}

function isPlaying () {
    if (btnPlay.classList.contains("play")) {
        return pauseMusic()
    }
    return playMusic()
}

function next () {
    songIndex += 1
    if (songIndex > songs.length - 1) {
        songIndex = 0
    }
    load(songs[songIndex])
}

function previous () {
    songIndex--
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    load(songs[songIndex])
}

function formatTime (time) {
    let hours = Math.floor(time / 3600)
    let minutes = Math.floor((time % 3600) / 60)
    let seconds = Math.floor((time % 3600) % 60)


    if (hours > 1 && minutes < 10) {
        minutes = `0${minutes}`
    }
    if (seconds < 10) {
        seconds = `0${seconds}`
    }
    if (hours < 1) {
        return `${minutes}:${seconds}`
    }

    return `${hours}:${minutes}:${seconds}`
}

btnPlay.addEventListener('click', isPlaying)
btnNext.addEventListener('click', next)
btnPrevious.addEventListener('click', previous)
audioPlayer.addEventListener('durationchange', () => {
    duration.innerHTML = formatTime(audioPlayer.duration)
})
audioPlayer.addEventListener('timeupdate', () => {
    const {currentTime: ct, duration} = audioPlayer
    currentTime.innerHTML = formatTime(ct)
    const result = Math.floor((ct / duration) * 10000) / 100
    progressBar.style.width = `${result}%`
})
progress.addEventListener('click', (e) => {
    const x = e.offsetX
    const maxWidth = progress.offsetWidth
    const duration = audioPlayer.duration

    audioPlayer.currentTime = Math.floor((x / maxWidth) * duration)
})

const volume = audioPlayer.volume

soundIcon.addEventListener('click', (e) => {
    e.preventDefault()
    if (audioPlayer.muted === false) {
        progressBarSound.value = 0
        return audioPlayer.muted = true
    }
    progressBarSound.value = volume
    return audioPlayer.muted = false
})

audioPlayer.addEventListener('volumechange', () => {
    const {volume, muted} = audioPlayer
    const result = Math.floor(volume * 100)

    if (result > 50) {
        soundIcon.classList.add('bi-volume-up-fill')
        soundIcon.classList.remove('bi-volume-down-fill', 'bi-volume-mute-fill')
    }
    if (result <= 50 && result > 0) {
        soundIcon.classList.remove('bi-volume-up-fill', 'bi-volume-mute-fill')
        soundIcon.classList.add('bi-volume-down-fill')
    }
    if (result === 0 || muted) {
        soundIcon.classList.remove('bi-volume-up-fill', 'bi-volume-down-fill')
        soundIcon.classList.add('bi-volume-mute-fill')
    }

    progressBarSound.value = muted ? 0 : result
})
progressBarSound.addEventListener('input', () => {
    const {value} = progressBarSound

    audioPlayer.muted = false
    audioPlayer.volume = value / 100
})

audioPlayer.addEventListener('ended', () => {
    next()
    audioPlayer.play()
})

audioPlayer.volume = 0.1

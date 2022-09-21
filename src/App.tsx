import moment from 'moment'
import { useEffect, useLayoutEffect, useState } from 'react'
import background from './assets/background.webp'
import edit from './assets/edit.svg'
import settings from './assets/settings.svg'
import eye from './assets/eye.svg'
import eyeOff from './assets/eyeOff.svg'
import upload from './assets/upload.svg'
import { Form } from './Form'

const TopSiteList = ({ sites, slices, className }) => {
	return sites?.slice(0, slices).map(({ title, url }) => {
		return (
			<li key={url} className={className}>
				<a className='text-white flex flex-col items-center' href={url}>
					<div className='bg-slate-300 max-w-[3.5rem] max-h-[3.5rem] w-full h-full p-5 rounded-full flex justify-center items-center text-gray-600 capitalize text-2xl'>
						{title.match(/[A-Za-z]/)}
					</div>
					<h3 className='max-w-[6rem] mt-2 text-lg text-ellipsis overflow-hidden whitespace-nowrap'>
						{title}
					</h3>
				</a>
			</li>
		)
	})
}

const App = () => {
	const [inputValue, setInputValue] = useState('')
	const [name, setName] = useState('')
	const [toggleTopSite, setToggleTopSite] = useState(true)
	const [isEditName, setIsEditName] = useState(false)
	const [backgroundImage, setBackgroundImage] = useState(background)
	const [{ hours, minutes }, setTime] = useState({ hours: '', minutes: '' })
	const [sites, setSites] = useState([])

	const formSubmit = () => {
		window.location.reload()
		localStorage.setItem('userName', inputValue)
		setIsEditName(false)
	}
	const inputHandler = (event: any) => {
		const { value } = event.target
		setInputValue(value)
	}

	const onEditName = () => {
		setIsEditName((state) => !state)
		setInputValue('')
	}

	const handleUserName = (userName: string) => {
		setName(userName)
	}

	useLayoutEffect(() => {
		const time = moment()
		const userName = localStorage.getItem('userName')
		const currentHour = parseInt(time.format('HH'))

		if (userName) {
			if (currentHour >= 3 && currentHour < 12) {
				handleUserName(`Good Morning ${userName}.`)
			} else if (currentHour >= 12 && currentHour < 15) {
				handleUserName(`Good Afternoon ${userName}.`)
			} else if (currentHour >= 15 && currentHour < 20) {
				handleUserName(`Good Evening ${userName}.`)
			} else if (currentHour >= 20 && currentHour < 3) {
				handleUserName(`Good Night ${userName}.`)
			} else {
				handleUserName(`Hello ${userName}.`)
			}
		}
	}, [isEditName, name, inputValue])

	const timeHandler = () => {
		const time = moment()
		setTime({ hours: time.format('h'), minutes: time.format('m a') })
	}
	const toggleTopSites = () => {
		setToggleTopSite((state) => !state)
		if (toggleTopSite) {
			localStorage.setItem('topSites', '0')
		} else {
			localStorage.setItem('topSites', '1')
		}
	}

	const onPickBackgroundImage = (event: any) => {
		if (event.target.files) {
			const fileReader = new FileReader()
			fileReader.readAsDataURL(event.target.files[0])
			fileReader.onload = () => {
				const imageUri = fileReader.result.toString()
				setBackgroundImage(imageUri)
				localStorage.setItem('backgroundImage', imageUri)
			}
		}
	}

	useEffect(() => {
		setInterval(timeHandler, 1000)
	}, [])

	useLayoutEffect(() => {
		timeHandler()
		const image = localStorage.getItem('backgroundImage')
		if (image) {
			setBackgroundImage(image)
		}

		const showTopSites = parseInt(localStorage.getItem('topSites'))
		if (showTopSites !== 1) {
			setToggleTopSite(false)
		}
		// @ts-ignore
		chrome.topSites
			.get()
			.then((response) => setSites(response))
			.catch((err) => console.log('error', err))
	}, [])

	return (
		<>	
			<img
				src={backgroundImage}
				alt='background image'
				className='absolute w-screen h-screen inset-0 overflow-hidden object-cover -z-10'
			/>
			<div className='flex justify-center items-center h-screen w-screen select-none bg-black/20 relative'>
				{!name && !isEditName && (
					<Form
						onCancel={onEditName}
						name={name}
						inputValue={inputValue}
						inputHandler={inputHandler}
						onSubmit={formSubmit}
					/>
				)}
				{isEditName && (
					<Form
						name={name}
						onCancel={onEditName}
						inputValue={inputValue}
						inputHandler={inputHandler}
						onSubmit={formSubmit}
					/>
				)}
				{name && !isEditName && (
					<div className='flex flex-col justify-center items-center'>
						{hours && minutes && (
							<h1 className='text-6xl lg:text-8xl font-medium text-white z-10 cursor-default select-none'>
								<span className='text-7xl lg:text-9xl font-bold'>{hours}</span>:{minutes}
							</h1>
						)}
						<div className='relative group'>
							<h2 className='text-center text-4xl md:text-5xl lg:text-7xl mt-5 text-white cursor-default select-none'>
								{name}
							</h2>
						</div>

						<ul
							className={`list-none max-w-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[auto,auto,auto,auto,auto] gap-x-10 relative transition duration-200 ease-in scale-0 origin-top w-full ${
								!toggleTopSite && 'scale-100'
							}`}>
							<TopSiteList sites={sites} slices={4} className='mt-10 md:hidden' />
							<TopSiteList sites={sites} slices={6} className='mt-10 hidden md:block lg:hidden' />
							<TopSiteList sites={sites} slices={10} className='mt-10 hidden lg:block ' />
						</ul>
					</div>
				)}
				<button className='absolute bottom-10 right-10 group'>
					<img src={settings} alt='settings' />

					<div className='bg-white absolute right-0 bottom-0 w-max rounded-md min-h-[2rem] min-w-[10rem] p-2 hidden group-hover:block'>
						<ul>
							<li className='flex items-center' onClick={onEditName}>
								<img src={edit} className='w-6 h-6 mr-2' alt='edit' />
								<p className='text-base whitespace-nowrap'>Edit Name</p>
							</li>
							<li className='flex items-center mt-3' onClick={toggleTopSites}>
								<img src={!toggleTopSite ? eyeOff : eye} className='w-6 h-6 mr-2' alt='edit' />
								<p className='text-base whitespace-nowrap'>
									{!toggleTopSite ? 'Hide Top Sites' : 'Show Top Sites'}
								</p>
							</li>
							<li className='flex items-center mt-3'>
								<img src={upload} className='w-6 h-6 mr-2' alt='upload image' />
								<label htmlFor='imagePicker'>
									<p className='text-base whitespace-nowrap cursor-pointer'>Pick Background Image</p>
									<input
										onChange={onPickBackgroundImage}
										type='file'
										accept='image/jpeg,webp,jpg,png'
										name='imagePicker'
										className='hidden'
										id='imagePicker'
									/>
								</label>
							</li>
						</ul>
					</div>
				</button>
			</div>
		</>
	)
}

export default App

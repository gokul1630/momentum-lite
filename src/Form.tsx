import { ChangeEvent } from 'react'

export interface FormProps {
	/** submit handler */
	onSubmit: (e?: any) => void
	/** cancel handler */
	onCancel: () => void
	/** input value */
	inputValue: any
	/** input handler */
	inputHandler: (e: ChangeEvent<HTMLInputElement>) => void
	/** name */
	name: string
}

export const Form = (props: FormProps) => {
	const { onSubmit, inputValue, inputHandler, onCancel, name } = props

	return (
		<div className='flex flex-col items-center z-10 bg-black/50 p-10 rounded-xl'>
			<label htmlFor='name'>
				<span className='hidden absolute max-h-0 max-w-0 overflow-hidden'>Hidden Label</span>
			</label>
			<input
				autoFocus
				autoComplete='off'
				value={inputValue}
				onChange={inputHandler}
				placeholder='Enter Your Name'
				className='border-b border-green-500 max-w-md focus:outline-none text-center text-2xl lg:text-4xl bg-transparent placeholder:text-gray-50 text-white'
				type='text'
				name='userName'
				id='name'
			/>
			<div className='flex mt-5'>
				{name && (
					<button
						onClick={onCancel}
						className='bg-gray-400 min-w-[100px] p-2 w-full rounded text-black text-base lg:text-lg mr-3'>
						Cancel
					</button>
				)}
				<button
					onClick={onSubmit}
					type='submit'
					className='bg-green-400 min-w-[100px] p-2 w-full rounded text-black text-base lg:text-lg'>
					Submit
				</button>
			</div>
		</div>
	)
}

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Card, Divider, Spin } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useWrap } from '~/context/wrap'
import { userApi } from '~/apiBase'
import TitlePage from '~/components/Elements/TitlePage'
import InputPassField from '~/components/FormControl/InputPassField'
import ProfileSummary from '~/components/ProfileSummary.tsx/ProfileSummary'
import { signOut } from 'next-auth/client'

let returnSchema = {}
let schema = null

const ChangePassword = (props) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm()
	const { showNoti, getDataUser, userInformation } = useWrap()
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	})
	const router = useRouter()
	const { dataUser } = props
	const [dataForm, setDataForm] = useState<IUser>(null)
	const [isNewUser, setIsNewUser] = useState(false)

	const defaultValuesInit = {
		KeyForgotPassword: '',
		Password: '',
		RePassword: ''
	}

	;(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit }
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'KeyForgotPassword':
					returnSchema[key] = yup.string().required('Bạn không được bỏ trống')
					break
				case 'Password':
					returnSchema[key] = yup.string().required('Bạn không được bỏ trống')
					break
				case 'RePassword':
					returnSchema[key] = yup
						.string()
						.oneOf([yup.ref('Password'), null], 'Password mới xác nhận lại chưa đúng')
						.required('Bạn không được bỏ trống')
					break
				default:
					break
			}
		})

		schema = yup.object().shape(returnSchema)
	})()

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	})

	// ----------- SUBMI FORM ------------
	const onSubmit = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		})
		let res = null
		try {
			res = await userApi.changePassword(data)
			res?.status == 200 && (showNoti('success', 'Đổi mật khẩu thành công'), form.reset(defaultValuesInit))
			localStorage.setItem('isNewUser', 'false')
			setTimeout(() => {
				signOut()
			}, 1000)
		} catch (error) {
			showNoti('danger', error.message)
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			})
		}
	}

	useEffect(() => {
		let checkNewUser = localStorage.getItem('isNewUser')

		if (checkNewUser === 'true') {
			setIsNewUser(true)
			form.setValue('KeyForgotPassword', '123456')
		}

		setIsLoading({
			type: 'FETCH_DATA',
			status: true
		})

		if (dataUser) {
			dataUser.Gender = parseInt(dataUser.Gender)
			setTimeout(() => {
				setIsLoading({
					type: 'FETCH_DATA',
					status: false
				})
			}, 500)
			if (userInformation === null) {
				setDataForm(dataUser)
			} else {
				setDataForm(userInformation)
			}
		}
	}, [userInformation])

	return (
		<>
			<TitlePage title="Đổi mật khẩu" />
			<div className="row">
				<div className="col-md-4 col-12">
					<Card className="info-profile-left" loading={isLoading.type === 'FETCH_DATA' && isLoading.status}>
						<ProfileSummary isFix={true} dataForm={dataForm} />
					</Card>
				</div>
				<div className="col-md-7 col-12">
					<Card className="space-top-card">
						<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
							<div className="row d-flex justify-content-center align-items-center">
								<h5>Form thay đổi mật khẩu</h5>

								<Divider></Divider>
							</div>

							<div className="row">
								<div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<InputPassField
										disabled={isNewUser ? true : false}
										form={form}
										name="KeyForgotPassword"
										label="Mật khẩu cũ"
										style={{ width: 500 }}
									/>
									<InputPassField form={form} name="Password" label="Mật khẩu mới" style={{ width: 500 }} />
									<InputPassField form={form} name="RePassword" label="Xác nhận mật khẩu mới" style={{ width: 500 }} />
								</div>
							</div>

							<div className="row mt-3">
								<div className="col-12 d-flex justify-content-center">
									<button type="submit" className="btn btn-primary">
										Lưu
										{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
									<button
										type="button"
										className="btn btn-warning ml-4"
										onClick={() => {
											localStorage.setItem('isNewUser', 'false')
											router.push('/')
										}}
									>
										Bỏ qua
										{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
									</button>
								</div>
							</div>
						</Form>
					</Card>
				</div>
			</div>

			<div></div>
		</>
	)
}

export default ChangePassword

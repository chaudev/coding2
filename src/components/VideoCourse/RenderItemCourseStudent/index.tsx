import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import Link from 'next/link'
import { parseToMoney } from '~/utils/functions'
import { Spin, Input } from 'antd'
import { useWrap } from '~/context/wrap'
import ModalUpdateDetail from '~/lib/video-course/modal-update-details'
import ModalUpdateInfo from '~/lib/video-course/modal-update-info'
import RatingStar from '~/components/RatingStar'
import { VideoCourseStoreApi } from '~/apiBase/video-course-store'

// CARD ITEM ON VIDEO COURSE
const RenderItemCard = (props) => {
	const {
		item,
		addToCard,
		dataCategory,
		categoryLevel,
		dataCurriculum,
		loading,
		activeLoading,
		handleActive,
		buyNowLoading,
		dataTeacher,
		refeshData,
		tags,
		onRefeshTags
	} = props
	const { userInformation, showNoti } = useWrap()

	const [showModalUpdate, setShowModalUpdate] = useState(false)
	const [showModalEdit, setShowModalEdit] = useState(false)
	const [activing, setActiving] = useState(false)
	const [code, setCode] = useState('')

	const params = {
		Category: item.CategoryName,
		CategoryID: item.CategoryID,
		Level: item.LevelName,
		Create: item.CreatedOn,
		Thum: item.ImageThumbnails,
		AverageRating: item.AverageRating,
		TotalFeedBack: item.TotalFeedBack,
		slug: item.ID,
		Original: item.OriginalPrice,
		Sell: item.SellPrice,
		Active: item.StatusActive,
		TotalVideo: item.TotalVideoCourseSold,
		TotalVideoViews: item?.TotalVideoViews,
		TeacherID: item?.TeacherID,
		CurriculumID: item?.CurriculumID,
		LimitBooking: item?.LimitBooking
	}

	// UPDATE COURSE
	const updateCourse = async (param: any) => {
		try {
			const res = await VideoCourseStoreApi.update(param)
			res.status == 200 && showNoti('success', 'Thành công')
			res.status !== 200 && showNoti('danger', 'Thêm không thành công')
		} catch (error) {
			showNoti('danger', 'Thêm không thành công')
		} finally {
			setShowModalEdit(false)
			refeshData()
		}
	}

	return (
		<>
			<div className="vc-store_container">
				<div className="vc-store_item" style={{ height: 260 }}>
					<div className="flip-card-front">
						{userInformation && userInformation.RoleID === 3 && item && item.isBought && (
							<div className="course-paid-icon">
								<img src="/images/paid.png" alt="paid icon" />
							</div>
						)}
						<div className="warp-image">
							<Link
								href={{
									pathname: '/video-course/[slug]',
									query: params
								}}
							>
								{item.ImageThumbnails === '' || item.ImageThumbnails === null || item.ImageThumbnails === undefined ? (
									<img src="/images/logo-thumnail.jpg" />
								) : (
									<img src={item.ImageThumbnails} />
								)}
							</Link>
						</div>

						<div className="content">
							<h3 style={{ width: '90%' }} className="title ml-3 mr-3 in-1-line">
								{item.VideoCourseName}
							</h3>
							<h3 style={{ width: '90%', fontSize: 12, color: '#000' }} className="title ml-3 mr-3 in-1-line">
								{item.EnglishName}
							</h3>
							{/* <span style={{ width: '90%' }} className="ml-3 mr-3 in-1-line">
								<i className="fas fa-play-circle mr-1"></i> {item.TotalVideoCourseSold} đã bán - {item.TotalVideoViews} lượt xem
							</span> */}

							{/* <Link href={{ pathname: '/video-course/[slug]', query: params }}>
								<div className="ml-3">
									<RatingStar AverageRating={item.AverageRating} TotalFeedBack={item.TotalFeedBack} />
								</div>
							</Link> */}

							<Link href={{ pathname: '/video-course/[slug]', query: params }}>
								<div className="ml-3 mb-3 price-group">
									<i
										className="price price-old"
										style={{
											textDecorationLine: 'line-through'
										}}
									>
										{parseToMoney(item.OriginalPrice)}đ
									</i>
									<span className="price">{parseToMoney(item.SellPrice)}đ</span>
								</div>
							</Link>
						</div>
					</div>

					<div className="flip-card-back p-3" style={{}}>
						<Link
							href={{
								pathname: '/video-course/[slug]',
								query: params
							}}
						>
							<div
								className="rotate180"
								style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: '100%', cursor: 'pointer' }}
							>
								<div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
									<h3 className="title mb-2">{item.VideoCourseName}</h3>
									<span className="in-1-line mb-1 ">
										<i className="fas fa-certificate mr-2"></i> {item.CategoryName}
									</span>
									<span className="in-1-line mb-1 ">
										<i className="fas fa-graduation-cap" style={{ marginRight: 7, fontSize: 12 }}></i> {item.LevelName}
									</span>
									{/* <span className="mb-1 in-1-line">
										<i className="fas fa-calendar-alt" style={{ marginRight: 8 }}></i> {item.CreatedOn}
									</span> */}

									<span className="mb-1 in-1-line">
										<i className="fas fa-clock mr-2"></i> Thời gian:{' '}
										{item?.ExpiryDays !== null || item?.ExpiryDays > 0 ? item?.ExpiryDays + ' ngày' : 'vĩnh viễn'}
									</span>

									<div style={{ flex: 1 }} />
									{userInformation?.RoleID == 1 || userInformation?.RoleID == 2 ? (
										<div style={{ zIndex: 99999 }}>
											{userInformation?.RoleID == 1 && (
												<button
													type="button"
													className=" btn btn-warning"
													style={{ width: '100%' }}
													onClick={(e) => {
														e.stopPropagation()
														setShowModalUpdate(true)
													}}
												>
													Chỉnh sửa
												</button>
											)}

											{userInformation !== null && (userInformation?.RoleID == 1 || userInformation?.RoleID == 2) && (
												<Link
													href={{
														pathname: '/video-learning',
														query: {
															ID: item.ID,
															course: item.ID,
															complete: 0 + '/' + 0,
															name: item.VideoCourseName
														}
													}}
												>
													<button className="btn btn-dark btn-add mt-2" style={{ width: '100%' }}>
														Xem khóa học
													</button>
												</Link>
											)}
										</div>
									) : (
										<>
											{activing ? (
												<>
													<Input
														onClick={(e) => e.stopPropagation()}
														value={code}
														onChange={(e) => setCode(e.target.value)}
														placeholder="Mã kích hoạt"
														style={{ height: 36, borderRadius: 6 }}
													/>
													<button
														onClick={(e) => {
															e.stopPropagation()
															handleActive({ VdieoCourseID: item.ID, ActiveCode: code })
														}}
														className="btn btn-warning btn-add mt-2"
													>
														Kích hoạt {activeLoading && <Spin className="loading-base" />}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation()
															setActiving(false)
														}}
														className="btn btn-primary btn-add mt-2"
													>
														Huỷ
													</button>
												</>
											) : (
												<>
													<button
														onClick={(e) => {
															e.stopPropagation()
															addToCard(item, 1)
														}}
														className="btn btn-primary btn-add"
													>
														Thêm vào giỏ {loading && <Spin className="loading-base" />}
													</button>
													{item.StatusActive == 'activated' ? (
														<Link
															href={{
																pathname: '/video-learning',
																query: {
																	ID: item.ID,
																	course: item.ID,
																	complete: 0 + '/' + 0,
																	name: item.VideoCourseName
																}
															}}
														>
															<button className="btn btn-dark btn-add mt-2" style={{ width: '100%' }}>
																Xem khóa học
															</button>
														</Link>
													) : (
														<button
															onClick={(e) => {
																e.stopPropagation()
																setActiving(true)
															}}
															className="btn btn-warning btn-add mt-2"
														>
															Kích hoạt
														</button>
													)}
													{/* <button
														onClick={(e) => {
															e.stopPropagation()
															addToCard(item, 0)
														}}
														className="btn btn-light btn-add mt-2"
													>
														Mua ngay {buyNowLoading && <Spin className="loading-base" />}
													</button> */}
												</>
											)}
										</>
									)}
								</div>
							</div>
						</Link>
					</div>
				</div>
			</div>

			<ModalUpdateInfo
				dataTeacher={dataTeacher}
				_onSubmitEdit={(data: any) => updateCourse(data)}
				programID={item.ID}
				rowData={item}
				isModalVisible={showModalUpdate}
				setIsModalVisible={setShowModalUpdate}
				refeshData={() => refeshData()}
				dataCategory={dataCategory}
				dataLevel={categoryLevel}
				dataCurriculum={dataCurriculum}
				tags={tags}
				onRefeshTags={onRefeshTags}
			/>

			<ModalUpdateDetail programID={item.ID} isModalVisible={showModalEdit} setIsModalVisible={setShowModalEdit} />
		</>
	)
}

export default RenderItemCard

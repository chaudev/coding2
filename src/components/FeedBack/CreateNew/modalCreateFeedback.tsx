import { Modal, Select, Input, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FeedbackCategoryApi } from '~/apiBase/feed-back-category';
import { useWrap } from '~/context/wrap';
import EditorSimple from '~/components/Elements/EditorSimple';
import { FeedbackApi } from '~/apiBase';

const { Option } = Select;

ModalCreateFeedback.propTypes = {
	visible: PropTypes.bool,
	onClose: PropTypes.func,
	handleCancel: PropTypes.func,
	created: PropTypes.func
};

ModalCreateFeedback.defaultProps = {
	visible: false,
	onClose: null,
	handleCancel: null,
	created: null
};

function ModalCreateFeedback(props) {
	const { visible, onClose, created } = props;
	const { showNoti, userInformation } = useWrap();
	const [categories, setCategories] = useState([]);
	const [isReset, setIsReset] = useState(false);
	const [textError, setTextError] = useState('');

	// Data submit
	const [type, setType] = useState(-1);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isPrioritized, setPrioritized] = useState(false);

	useLayoutEffect(() => {
		getFeedBackCategory();
	}, []);

	// GET DATA
	const getFeedBackCategory = async () => {
		const temp = {
			pageIndex: 1,
			pageSize: 20
		};
		try {
			const res = await FeedbackCategoryApi.getAll(temp);
			res.status == 200 && setCategories(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// POST DATA
	const handleCreate = async () => {
		const temp = {
			UID: userInformation.UserInformationID,
			TypeID: type,
			Title: title,
			ContentFeedBack: content,
			isPrioritized: isPrioritized
		};
		try {
			const res = await FeedbackApi.add(temp);
			// res.status == 200 && setCategories(res.data.data);
			setIsReset(true);
			created();
			setIsReset(false);
		} catch (error) {
			console.log(error);
		}
	};

	// SELECT TYPE
	function handleChangeType(value) {
		setType(value);
	}

	// PRESS OK BUTTON
	const handleOk = () => {
		if (type === -1) {
			setTextError('Vui l??ng ch???n lo???i');
		} else {
			if (title === '') {
				setTextError('Vui l??ng nh???p ti??u ?????');
			} else {
				handleCreate();
				onClose();
			}
		}
	};

	// PRESS CANCEL
	const handleCancel = () => {
		onClose();
	};

	function onPressCheckbox() {
		setPrioritized(!isPrioritized);
	}

	// RENDER
	return (
		<>
			<Modal width={800} title="T???o ph???n h???i" visible={visible} onOk={handleOk} onCancel={handleCancel}>
				<div className="c-feedback">
					<div className="row m-0 st-fb-center">
						<div className="row m-0 st-fb-center st-fb-fw">
							<span className="c-feedback__title mr-4">Lo???i ph???n h???i:</span>
							<Select className="c-feedback__select" defaultValue="Ch???n lo???i" onChange={handleChangeType}>
								{categories.map((item, index) => (
									<Option value={item.ID}>{item.Name}</Option>
								))}
							</Select>
						</div>
						<div className="row ml-4 m-0 st-fb-center">
							<span className="c-feedback__title mr-4">??u ti??n</span>
							<Checkbox onChange={onPressCheckbox} checked={isPrioritized} />
						</div>
					</div>
					<div className="row m-0 mt-3 st-fb-center">
						<span className="c-feedback__title mr-5">Ti??u ?????:</span>
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="c-feedback__i-title"
							placeholder="Nh???p ti??u ?????"
						/>
					</div>

					<div className="mb-0" style={{ paddingTop: 15 }}>
						<EditorSimple
							handleChange={(value) => {
								setContent(value);
							}}
							// isTranslate={true}
							isReset={isReset}
							questionContent={content}
						/>
					</div>

					{textError !== '' && <p className="c-feedback__error mt-3 st-fb-100w">{textError}</p>}
				</div>
			</Modal>
		</>
	);
}

export default ModalCreateFeedback;

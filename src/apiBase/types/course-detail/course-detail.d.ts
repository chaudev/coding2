type ICourseDetailSchedule = {
	ID: number | string
	CourseID: number
	CourseName: string
	BranchID: number
	BranchName: string
	RoomID?: number
	RoomName?: string
	StudyTimeName: string
	StudyTimeID: number
	Date: string
	StartTime: string
	EndTime: string
	TeacherID: number
	TeacherName: string
	SubjectID: number
	SubjectName: string
	CurriculumID: number
	isValid?: boolean
	ProgramID: number
	LinkDocument?: string
	TeacherAttendanceID?: any
	Status?: number
	IsExam: any
}

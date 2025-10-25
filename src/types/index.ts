// Logistics management types will be added here as needed

// HYVE Platform API Types

// Enums
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum UserType {
  DE = 'de',
  DEH = 'deh',
  USER = 'user',
  ADMIN = 'admin',
}

export enum KycStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum KycDocumentType {
  PAN = 'PAN',
  AADHAAR = 'AADHAAR',
  VOTER_ID = 'VOTER_ID',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export enum TripStatus {
  NEW = 'New',
  ASSIGNED = 'Assigned',
  OUT_TO_PICKUP = 'Out to Pickup',
  REACHED_AT_LOCATION = 'Reached at Location',
  PICKED_UP = 'Picked Up',
  OUT_TO_DISPATCH = 'Out to Dispatch',
  DISPATCHED = 'Dispatched',
  CANCELLED = 'Cancelled',
}

// We need a string type for TripStatus to handle API responses
export type TripStatusString =
  | 'New'
  | 'Assigned'
  | 'Out to Pickup'
  | 'Reached at Location'
  | 'Picked Up'
  | 'Out to Dispatch'
  | 'Dispatched'
  | 'Cancelled'

export enum TimeScope {
  TODAY = 'TODAY',
  FUTURE = 'FUTURE',
  HISTORY = 'HISTORY',
}

// Base interfaces
export interface BaseEntity {
  id: string
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserDto {
  id: string
  firstName: string
  lastName?: string
  email?: string
  contact: string
  name: string
  photoUrl?: string
  status: UserStatus
  userType: UserType
  username: string
  manager?: UserDto
}

export interface User extends BaseEntity {
  firstName: string
  lastName?: string
  name: string
  photoUrl?: string
  status: UserStatus
  contact: string
  userType: UserType
  username: string
  email?: string
  manager?: User
  reportees?: User[]
  vendor?: string
}

// User Types - Updated to match API schema
export interface UserPayload {
  firstName: string
  lastName?: string
  email: string
  password: string
  role?: string
  contact?: string
  clientCode?: string
  centerCode?: string
}

export interface UserInfo extends BaseEntity {
  firstName?: string
  lastName?: string
  username?: string
  role?: string
  contact?: string
  clientCode?: string
  centerCode?: string
  userType?: 'CLIENT' | 'CLIENT_CENTER' | 'SYS'
  photoUrl?: string
  verified?: boolean
  status?: UserStatus
}

export interface UserPatch {
  contact?: string
  firstName?: string
  lastName?: string
  photoUrl?: string
}

export interface UserSearchParams extends PaginationParams {
  search?: string
  searchText?: string
  role?: string
  userType?: 'CLIENT' | 'CLIENT_CENTER' | 'SYS'
  status?: UserStatus
  verified?: boolean
  clientCode?: string
  centerCode?: string
}

// KYC Types
export interface KycDocument {
  id: number
  kycRecord?: KycRecord
  type: KycDocumentType
  documentNumber: string
  fileUrl?: string
  verified: boolean
  notes?: string
}

export interface KycRecord extends BaseEntity {
  user: User
  status: KycStatus
  submittedAt?: string
  verifiedAt?: string
  verifier?: string
  rejectionReason?: string
  documents: KycDocument[]
}

// (Removed rider-specific types)

// Center Types
export interface CenterInfo extends BaseEntity {
  clientCode?: string
  code: string
  name: string
  city: string
  state: string
  zone?: string
  address: string
  lat?: number
  lng?: number
  pinCode: string
  spoc1Name?: string
  spoc1Contact?: string
  spoc2Name?: string
  spoc2Contact?: string
  description?: string
  files?: CenterFile[]
}

export interface CenterFile {
  url: string
  filename: string
}

export interface CenterInfoReq {
  code: string
  name: string
  address: string
  city: string
  state: string
  pinCode: string
  zone?: string
  description?: string
  lat?: string
  lng?: string
  spoc1Name?: string
  spoc1Contact?: string
  spoc2Name?: string
  spoc2Contact?: string
}

// Trip Types
export interface LocalTime {
  hour: number
  minute: number
  second: number
  nano: number
}

export interface ScheduleSlot {
  scheduleDate: string
  startTime: LocalTime | string | null // Allow string format for API compatibility
  endTime?: LocalTime | string | null // Allow string format for API compatibility
  zoneId?: string
}

export interface TripPayload {
  examCode?: string
  examDate?: string
  addressCode: string
  scheduleSlot: ScheduleSlot
  assignedTo: string
  coordinatorName?: string
  coordinatorContact?: string
}

export interface ItemInfo {
  id: string
  tripId?: string
  seqNum?: number
  label?: string
  type: string
  value?: string
  courier?: string
  docket?: string
}

export interface ItemInfoUpdate {
  id: string // The ID of the item to update
  value?: string // The new value for the item
}

export interface UserCoordinatePayload {
  lat?: number
  lng?: number
}

export interface TripSearchFilter {
  examCodes?: string[]
  examDate?: string
  zones?: string[]
  statuses?: TripStatus[]
  timeScope?: TimeScope
  // riderIds removed
  // riderHeadIds removed
  addressCodes?: string[]
  searchText?: string
  sortBy?: {
    field: string
    order: 'ASC' | 'DESC'
  }[]
}

export interface Trip {
  id: string
  examCode?: string
  examDate?: string
  projectCode?: string
  // riderId removed
  addressCode: string
  addressName?: string
  address?: CenterInfo | string
  city?: string
  state?: string
  pinCode?: string
  zone?: string
  status: TripStatus | TripStatusString
  scheduledStartTime?: string
  scheduledEndTime?: string
  coordinatorName?: string
  coordinatorContact?: string
  spoc1Name?: string
  spoc1Contact?: string
  // riderHeadId removed
  // riderInfo removed
  assignedTo?: string
  toCenter?: string
  toCity?: string
  toPinCode?: string
  toState?: string
  scheduleSlot?: ScheduleSlot
  // rider removed
  items?: ItemInfo[]
  files?: Array<{ url: string }>
  statusHistory?: Array<{
    status: TripStatus | TripStatusString
    timestamp: string
    userId?: string
    userName?: string
  }>
  createdAt?: string
  updatedAt?: string
}

// Upload Types
export interface UploadedFile extends BaseEntity {
  category?: string
  extRefId?: string
  url: string
  encodedPath?: string
  srcFilename?: string
  modFilename?: string
  fileDir?: string
}

// Common Types
export interface StatePayload {
  name: string
  lat: number
  lng: number
}

export interface CityPayload {
  name: string
  lat: number
  lng: number
}

export interface AppBannerReq {
  title?: string
  description?: string
  imageUrl?: string
  redirectUrl?: string
  active?: boolean
  startAt?: string
  endAt?: string
  displayOrder?: number
}

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Search and Filter Types
export interface PaginationParams {
  page?: number
  size?: number
}

// RiderSearchParams removed

export interface CenterSearchParams extends PaginationParams {
  search?: string
  zone?: string | string[]
  city?: string
  state?: string | string[]
}

export interface TripSearchParams extends PaginationParams, TripSearchFilter {
  // Combines pagination with search filters
}

// Task Types
export interface TaskInfo extends BaseEntity {
  clientCode?: string
  centerCode?: string
  role?: string
  taskDate: string
  templateVersion?: number
  taskId?: string
  seqNumber?: number
  taskLabel?: string
  taskType?: string
  selectOptions?: string[]
  required?: boolean
  subTasks?: any[]
  textValue?: string | null
  numberValue?: number | null
  files?: UploadedFile[]
  selectedOptions?: string[]
  checkboxValue?: boolean | null
  submittedBy?: string | null
  submittedAt?: string | null
  syncedAt?: string | null
  taskStatus?: string
  lat?: number | null
  lng?: number | null
}

export interface TaskAddRequest {
  taskDate: string
  type?: 'ALL' | 'CENTER'
  centerCodes?: string[]
  clientCode?: string
}

export interface TaskUpdateRequest {
  textValue?: string
  numberValue?: number
  selectedOptions?: string[]
  checkboxValue?: boolean
  userId?: string
  submittedAt?: string
}

export interface CenterTaskMapRequest {
  clientCode?: string
  centerCode: string
  role: string
  templateVersion?: number
  templateName: string
  active?: boolean
}

// Task summary types based on API response
export interface TaskStatusSummary {
  status: string
  count: number
}

export interface TaskSummaryRole {
  role: string
  statusSummary: TaskStatusSummary[]
}

export interface TaskSummaryCenter {
  centerId?: string
  centerCode: string
  centerName: string
  city?: string
  state?: string
  roles: TaskSummaryRole[]
}

export interface TasksResponse {
  taskSummary: TaskSummaryCenter[]
  taskList: TaskInfo[]
}

export interface TaskSearchParams extends PaginationParams {
  // New payload fields
  taskDate?: string
  type?: 'ALL' | 'CENTER'
  centerCodes?: string[]
  clientCode?: string
  // Backward-compat fields mapping
  date?: string
  centerCode?: string
  role?: string
  summary?: boolean
  taskList?: boolean
  // Cache-busting parameter
  _t?: number
}

// Job Types for background jobs management
export interface Job extends BaseEntity {
  id: string
  jobType?: string // Maps to 'type' in the current interface
  jobStatus?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PROGRESS'
  message?: string
  phase?: string
  data?: string // File name
  corrId?: string
  isDeleted?: number
  keyValObjects?: any[]
  // Legacy properties for backward compatibility
  name?: string
  status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  type?: string
  description?: string
  startedAt?: string
  completedAt?: string
  progress?: number
  result?: any
  error?: string
}

export interface JobSearchParams extends PaginationParams {
  status?: string
  type?: string
  search?: string
}

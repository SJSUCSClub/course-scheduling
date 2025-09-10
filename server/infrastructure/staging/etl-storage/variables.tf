variable "cource_scheduler_etl_role"{}

variable "bucket"{
    description = "Etl bucket name"
    type = string
    default = "course-scheduling-hist-sched-storage-dev-440744215929-us-west-2"
}
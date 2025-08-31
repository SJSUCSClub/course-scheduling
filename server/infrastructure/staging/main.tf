provider "aws"{
    region = "us-west-2"
    assume_role {
      role_arn = "arn:aws:iam::440744215929:role/CourseSchedulingTerraformRoleForStagingAndDevelopmentEnvironment"
      session_name = "course-scheduling-staging-role"
    }
}
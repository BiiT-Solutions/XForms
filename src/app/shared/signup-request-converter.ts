import {SignUpRequest} from "biit-ui/login/biit-login/models/sign-up-request";
import {SignUpRequest as UserManagerSignUpRequest,} from "user-manager-structure-lib";

export class SignupRequestConverter {
  public static convertSignUpRequest(signUpRequest: SignUpRequest, username?: string): UserManagerSignUpRequest  {
    const userManagerSignUpRequest: UserManagerSignUpRequest = new UserManagerSignUpRequest();
    userManagerSignUpRequest.username = `${signUpRequest.name[0]}${signUpRequest.lastname}${Math.trunc(Math.random() * 1000)}`.replace(/[^a-zA-Z0-9]/g, '_');
    userManagerSignUpRequest.email = signUpRequest.email;
    userManagerSignUpRequest.firstname = signUpRequest.name;
    userManagerSignUpRequest.lastname = signUpRequest.lastname;
    userManagerSignUpRequest.password = signUpRequest.password;
    userManagerSignUpRequest.team = signUpRequest.team;
    userManagerSignUpRequest.organization = signUpRequest.organization;
    return userManagerSignUpRequest
  }
}

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, logout, register, clearError, setUser } from '../store/slices/authSlice';
import { LoginCredentials, RegisterData } from '../@types/auth';
import { User } from '../@types/user';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { token, user, isAuthenticated, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    return {
    // State
        token,
        user,
        isAuthenticated,
        isLoading,
        error,

        // Actions
        login: (credentials: LoginCredentials) =>
            dispatch(login(credentials)),
        register: (userData: RegisterData) =>
            dispatch(register(userData)),
        logout: () => dispatch(logout()),
        clearError: () => dispatch(clearError()),
        updateUser: (user: User) => dispatch(setUser(user)),
    };
};
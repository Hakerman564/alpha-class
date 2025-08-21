import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './SignupForm.css';

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  workType: 'Freelancer' | 'Consultant' | 'Independent Contractor' | 'Other' | '';
  agree: boolean;
};

const emailPattern = /^(?:[a-zA-Z0-9_'^&+%\-]+(?:\.[a-zA-Z0-9_'^&+%\-]+)*)@(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}$/;

function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score >= 3) return 'strong';
  if (score === 2) return 'medium';
  return 'weak';
}

const SignupForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SignupFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { workType: '', agree: false }
  });

  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const password = watch('password');
  const strength = useMemo(() => getPasswordStrength(password || ''), [password]);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(values: SignupFormValues) {
    setSignupError('');
    const success = await signup(values.email, values.password, values.fullName);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setSignupError('Error al crear la cuenta. Intenta de nuevo.');
    }
  }

  async function checkEmailAvailability(value: string) {
    setEmailCheckLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setEmailCheckLoading(false);
    // Placeholder: In a real app, check if email `value` is available
    console.log('Checking email availability for:', value);
    return true; // Always available in this placeholder
  }

  return (
    <div className="auth-card" role="region" aria-labelledby="signup-title">
      <div className="auth-card-header">
        <h1 id="signup-title" className="auth-title">Join TrackIt</h1>
        <div className="brand">TrackIt</div>
        <p className="subtitle">Manage your capital with clarity and ease.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={errors.fullName ? 'true' : 'false'}
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && <p className="form-error" role="alert">{errors.fullName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: emailPattern, message: 'Enter a valid email' },
              validate: async (v) => (await checkEmailAvailability(v)) || 'Email already in use'
            })}
          />
          {emailCheckLoading && <p className="hint">Checking email…</p>}
          {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' }
            })}
          />
          <div className={`strength ${strength}`}>Strength: {strength}</div>
          {errors.password && <p className="form-error" role="alert">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={errors.confirmPassword ? 'true' : 'false'}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === password || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <p className="form-error" role="alert">{errors.confirmPassword.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="workType">Work type</label>
          <select id="workType" aria-invalid={errors.workType ? 'true' : 'false'} {...register('workType', { required: 'Select your work type' })}>
            <option value="">Select…</option>
            <option value="Freelancer">Freelancer</option>
            <option value="Consultant">Consultant</option>
            <option value="Independent Contractor">Independent Contractor</option>
            <option value="Other">Other</option>
          </select>
          {errors.workType && <p className="form-error" role="alert">{errors.workType.message}</p>}
        </div>

        <div className="form-row">
          <label className="checkbox">
            <input type="checkbox" {...register('agree', { required: 'You must agree to continue' })} />
            <span>I agree to TrackIt's <a className="link" href="#">Terms of Service</a> and <a className="link" href="#">Privacy Policy</a></span>
          </label>
        </div>
        {errors.agree && <p className="form-error" role="alert">{errors.agree.message}</p>}

        {signupError && (
          <p className="form-error" role="alert">{signupError}</p>
        )}

        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
              <span>Creando cuenta…</span>
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        <div className="form-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="link">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;



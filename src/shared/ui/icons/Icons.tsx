import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function PhoneIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
			/>
		</svg>
	);
}

export function LightningIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
		</svg>
	);
}

export function ChartIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
			/>
		</svg>
	);
}

export function ArrowRightIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
		</svg>
	);
}

export function CheckCircleIcon(props: IconProps) {
	return (
		<svg fill="currentColor" viewBox="0 0 20 20" {...props}>
			<path
				fillRule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export function HomeIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
			/>
		</svg>
	);
}

export function UsersIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	);
}

export function BoxIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
			/>
		</svg>
	);
}

export function CameraIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}

export function CogIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	);
}

export function LogoutIcon(props: IconProps) {
	return (
		<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
			/>
		</svg>
	);
}

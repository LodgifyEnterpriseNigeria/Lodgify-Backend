import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Box, BoxContent, BoxFooter, BoxHeader, BoxSubText, BoxTitle } from '@/components/blocks/box.block';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_admin/settings/account')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="space-y-10">
			<Box>
				<BoxHeader>
					<div className="flex justify-between flex-col gap-6 md:flex-row">
						<div>
							<BoxTitle>Admin Avatar</BoxTitle>
							<BoxSubText>Change your admin name here. Click the profile section to add an image</BoxSubText>
						</div>
						<div className="h-20 w-20 rounded-full bg-primary"  ></div>
					</div>
				</BoxHeader>
				<BoxFooter
					moreInfo='Make sure to save as this session would be lost'
				/>
			</Box>

			<Box>
				<BoxHeader>
					<BoxTitle>Admin Name</BoxTitle>
					<BoxSubText>Change your admin name here. Click the profile section to add an image</BoxSubText>
				</BoxHeader>
				<BoxContent>
					<div className="max-w-lg md:w-lg">
						<Input placeholder='Your name' />
					</div>
				</BoxContent>
				<BoxFooter
					moreInfo='Please use 32 characters at maximum.'
					action={<Button>Update</Button>}
				/>
			</Box>
		</div>
	);
}

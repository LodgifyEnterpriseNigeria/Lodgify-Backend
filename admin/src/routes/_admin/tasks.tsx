import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import type { z } from 'zod'
import Header from '@/components/blocks/header'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Endpoint from '@/api/endpoints'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { taskSchema } from '@/schemas/task.schema'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TaskCards } from '@/components/contents/tasks/cards'
import TaskTable from '@/components/contents/tasks/dataTable'
import { taskColumns } from '@/components/contents/tasks/columns'

export const Route = createFileRoute('/_admin/tasks')({
	component: RouteComponent,
})

function RouteComponent() {
	const dummyData: Array<any> = []
	return (
		<>
			<Header title='Airdrop Tasks' subText="Manage and create new airdrop tasks.">
				<CreateTaskDialog />
			</Header>

			<TaskCards />

			<TaskTable data={dummyData} columns={taskColumns} />
		</>
	)
}


function CreateTaskDialog() {
	const [step, setStep] = useState<0 | 1>(0)

	const { mutateAsync: createTaskMutation, isPending } = useMutation({
		mutationFn: Endpoint.createTask,
		onSuccess: (data) => {
			toast.success('Task created successfully', {
				description: data.message,
			})
			form.reset();
			setStep(0);
		},
		onError: (error: any) => {
			form.reset();
			setStep(0);
			toast.error('Failed to create task', {
				description: error?.response?.data?.message || error.message || "An error occurred"
			})
		}
	})

	const form = useForm<z.infer<typeof taskSchema>>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			name: "",
			message: "",
		},
	})

	async function onSubmit(values: z.infer<typeof taskSchema>) {
		console.log(values)
		await createTaskMutation({
			...values
		})
	}

	function handleNext() {
		const isValid = form.getValues("name") && form.getValues("points") && form.getValues("message") && form.getValues("duration")
		if (isValid) setStep(1)
		else form.trigger(["name", "points", "duration", "message"])
	}

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) {
					setStep(0)
					form.reset()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>Create Task</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[600px] md:w-[550px]">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<DialogHeader>
							<DialogTitle>Create Airdrop Task</DialogTitle>
							<DialogDescription>
								Fill out the required task information.
							</DialogDescription>
						</DialogHeader>

						{step === 0 && (
							<section className="space-y-4 rounded-md">

								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Task Name</FormLabel>
											<FormControl>
												<Input placeholder="Follow on Twitter" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="message"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea rows={3} placeholder="Thanks for completing this task!" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-between items-start gap-4 flex-col md:flex-row">
									<FormField
										control={form.control}
										name="points"
										render={({ field }) => (
											<FormItem className='w-full'>
												<FormLabel>Points</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="e.g. 10000 LP"
														{...field}
														value={field.value}
														onChange={(e) => field.onChange(Number(e.target.value))}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="duration"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Duration (hours)</FormLabel>
												<FormControl>
													<Input
														type="number"
														placeholder="e.g. 1"
														{...field}
														value={field.value}
														onChange={(e) => field.onChange(Number(e.target.value))}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</section>
						)}

						{step === 1 && (
							<section className="space-y-4 rounded-md">

								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Task Type</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Is this a core task?" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="core">Core</SelectItem>
													<SelectItem value="special">Special</SelectItem>
													<SelectItem value="daily">Daily</SelectItem>
													<SelectItem value="collab">Colaburation</SelectItem>
													<SelectItem value="giveaway">Giveaway</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="platform"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Platform</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Pick a platform" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="x">X (Twitter)</SelectItem>
													<SelectItem value="instagram">Instagram</SelectItem>
													<SelectItem value="tiktok">TikTok</SelectItem>
													<SelectItem value="youtube">YouTube</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex justify-between items-start gap-4 flex-col md:flex-row">

									<FormField
										control={form.control}
										name="activeFrom"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Task activates from</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="When does the task start" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="signUp">User sign up</SelectItem>
														<SelectItem value="task launch">Task launch</SelectItem>
														{/* <SelectItem value="time bound">Time bound event</SelectItem> */}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="verifyBy"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Verify By</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Task verifyed by?" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="bot">Bot</SelectItem>
														<SelectItem value="admin">Admin</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</section>
						)}

						<DialogFooter className="flex-row justify-between pt-2 flex md:justify-between items-center">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase">
								{
									step === 0 ? (
										"1: Task Basics"
									) : (
										"2: Task Config"
									)
								}
							</h3>

							<div className="flex gap-2">
								{/* {step === 1 && (
									<Button type="button" variant="ghost" onClick={() => setStep(0)}>
										Back
									</Button>
								)} */}

								{step === 0 ? (
									<Button type="button" onClick={handleNext}>
										Next
									</Button>
								) : (
									<Button type="submit" disabled={isPending}>
										{isPending ? "Submitting..." : "Add Task"}
									</Button>
								)}
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
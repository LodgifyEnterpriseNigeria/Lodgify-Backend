import { createFileRoute } from '@tanstack/react-router'
import type { User } from '@/components/contents/users/columns'
import { UserCards } from '@/components/contents/users/cards'
import { userColumns } from '@/components/contents/users/columns'
import UaerTable from '@/components/contents/users/dataTable'
import Header from '@/components/blocks/header'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_admin/users')({
    component: RouteComponent,
})

const dummyData: Array<User> = [
    {
        "fullName": "Tanner Linsley",
        "username": "tannerlinsley",
        "verified": true,
        "refCount": 20,
        "email": "user@mail.com",
        "phoneNumber": "+1234567890",
        "dateOfBirth": "1990-01-01",
    },
    {
        "fullName": "Jane Doe",
        "username": "janedoe",
        "verified": false,
        "refCount": 12,
        "email": "jane.doe@example.com",
        "phoneNumber": "+1987654321",
        "dateOfBirth": "1992-05-15",
    },
    {
        "fullName": "John Smith",
        "username": "johnsmith",
        "verified": true,
        "refCount": 8,
        "email": "john.smith@example.com",
        "phoneNumber": "+1123456789",
        "dateOfBirth": "1988-09-23",
    },
    {
        "fullName": "Alice Johnson",
        "username": "alicej",
        "verified": false,
        "refCount": 5,
        "email": "alice.johnson@example.com",
        "phoneNumber": "+1098765432",
        "dateOfBirth": "1995-12-30",
    },
    {
        "fullName": "Bob Williams",
        "username": "bobw",
        "verified": true,
        "refCount": 15,
        "email": "bob.williams@example.com",
        "phoneNumber": "+1230984567",
        "dateOfBirth": "1985-07-11",
    },
    {
        "fullName": "Emily Carter",
        "username": "emilyc",
        "verified": false,
        "refCount": 10,
        "email": "emily.carter@example.com",
        "phoneNumber": "+1012345678",
        "dateOfBirth": "1993-03-22",
    },
    {
        "fullName": "Michael Brown",
        "username": "michaelb",
        "verified": true,
        "refCount": 18,
        "email": "michael.brown@example.com",
        "phoneNumber": "+1023456789",
        "dateOfBirth": "1987-11-05",
    },
    {
        "fullName": "Sophia Lee",
        "username": "sophial",
        "verified": false,
        "refCount": 7,
        "email": "sophia.lee@example.com",
        "phoneNumber": "+1034567890",
        "dateOfBirth": "1996-08-14",
    },
    {
        "fullName": "David Kim",
        "username": "davidk",
        "verified": true,
        "refCount": 22,
        "email": "david.kim@example.com",
        "phoneNumber": "+1045678901",
        "dateOfBirth": "1989-04-19",
    },
    {
        "fullName": "Olivia Martinez",
        "username": "oliviam",
        "verified": false,
        "refCount": 9,
        "email": "olivia.martinez@example.com",
        "phoneNumber": "+1056789012",
        "dateOfBirth": "1994-10-27",
    }
]

function RouteComponent() {
    return (
        <>
            <Header title={`User Analytics`} subText='Manage and analyze user data'>
                <Button>Create User</Button>
            </Header>

            <UserCards />
            <UaerTable data={dummyData} columns={userColumns} />
        </>
    )
}

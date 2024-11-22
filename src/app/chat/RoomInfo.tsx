import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@mui/material';
import { Label } from '@radix-ui/react-dropdown-menu';

export function RoomDescription() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type='button'
                    className='mdi mdi-information-outline description-button'
                ></button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px] bg-white'>
                <DialogHeader>
                    <DialogTitle>Room Info</DialogTitle>
                    <DialogDescription>
                        Make changes to your room here. Click save when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid items-center gap-4'>
                        <h3 className='text-base/7 font-semibold text-gray-900'>
                            Room Description:
                        </h3>
                        <br></br>
                        <Input
                            id='name'
                            defaultValue='Add group description here...'
                            className='col-span-3'
                        />
                    </div>
                    <div className='grid items-center gap-4'>
                        <h6 className='text-base/7 font-semibold text-gray-900'>
                            Room Member(s):
                        </h6>
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

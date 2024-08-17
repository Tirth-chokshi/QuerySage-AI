"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function NewChatDialog({ isOpen, onClose, onSubmit }) {
    const [chatName, setChatName] = useState('');
    const [dbType, setDbType] = useState('');
    const [dbInfo, setDbInfo] = useState({
        host: '',
        user: '',
        password: '',
        database: '',
        uri: '',
        filename: '',
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ chatName, dbType, dbInfo });
        onClose();
        setChatName('');
        setDbType('');
        setDbInfo({
            host: '',
            user: '',
            password: '',
            database: '',
            uri: '',
            filename: '',
        });
    };

    const renderDbFields = () => {
        switch (dbType) {
            case 'mysql':
            case 'postgresql':
                return (
                    <>
                        <Label htmlFor="host">Host</Label>
                        <Input
                            id="host"
                            value={dbInfo.host}
                            onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                        />
                        <Label htmlFor="user">User</Label>
                        <Input
                            id="user"
                            value={dbInfo.user}
                            onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                        />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={dbInfo.password}
                            onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                        />
                        <Label htmlFor="database">Database</Label>
                        <Input
                            id="database"
                            value={dbInfo.database}
                            onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                        />
                    </>
                );
            case 'mongodb':
                return (
                    <>
                        <Label htmlFor="uri">MongoDB URI</Label>
                        <Input
                            id="uri"
                            value={dbInfo.uri}
                            onChange={(e) => setDbInfo({ ...dbInfo, uri: e.target.value })}
                        />
                    </>
                );
            case 'sqlite':
                return (
                    <>
                        <Label htmlFor="filename">SQLite Filename</Label>
                        <Input
                            id="filename"
                            value={dbInfo.filename}
                            onChange={(e) => setDbInfo({ ...dbInfo, filename: e.target.value })}
                        />
                    </>
                );
            case 'csv':
                return (
                    <>
                        <Label htmlFor="filename">Upload CSV file upto 200MB</Label>
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={(e) => setDbInfo({ ...dbInfo, filename: e.target.value })}
                            required
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Chat</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new chat session.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="chatName" className="text-right">
                                Chat Name
                            </Label>
                            <Input
                                id="chatName"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dbType" className="text-right">
                                Database Type
                            </Label>
                            <Select onValueChange={(value) => setDbType(value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select database type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="mysql">MySQL</SelectItem>
                                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                                    <SelectItem value="mongodb">MongoDB</SelectItem>
                                    <SelectItem value="sqlite">SQLite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {renderDbFields()}
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Chat</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
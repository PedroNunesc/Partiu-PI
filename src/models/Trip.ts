import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Item } from "./Item";

@Entity('trips')
export class Trip {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column()
    destination: string;

    @Column({ type: "date" })
    startDate: string;

    @Column({ type: "date" })
    endDate: string;

    @Column({ nullable: true })
    weather?: string;

    @Column({
        type: "enum",
        enum: ["praia", "negocios", "inverno", "aventura", "outro"],
        default: "outro"
    })
    type!: string;

    @Column({ default: false })
    isFavorite!: boolean;

    @ManyToOne(() => User, (user) => user.trips, { onDelete: "CASCADE" })
    user: User;

    @OneToMany(() => Item, (item) => item.trip, { cascade: true })
    items!: Item[];

    constructor(name: string, destination: string, startDate: string, user: User, endDate: string) {
        this.name = name;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
        this.items = [];
    }
}
